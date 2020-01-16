package main

import (
	"net/http"
	"runtime/debug"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/rs/zerolog/hlog"
	"github.com/rs/zerolog/log"
	"github.com/spf13/viper"
	"github.com/tegioz/hub/internal/hub"
)

type handlers struct {
	cfg    *viper.Viper
	hubApi *hub.Hub
	router http.Handler
}

func setupHandlers(cfg *viper.Viper, hubApi *hub.Hub) *handlers {
	h := &handlers{
		cfg:    cfg,
		hubApi: hubApi,
	}
	h.setupRouter()
	return h
}

func (h *handlers) setupRouter() {
	r := httprouter.New()

	// Recover panics from http handlers
	r.PanicHandler = panicHandler

	// Routes
	r.GET("/api/v1/search", h.search)
	r.GET("/api/v1/package/:package_id", h.getPackage)
	r.GET("/api/v1/package/:package_id/:version", h.getPackageVersion)
	r.ServeFiles("/static/*filepath", http.Dir(h.cfg.GetString("server.static-files-path")))

	// Wrap router with access handler middleware and return it
	h.router = accessHandler()(r)
}

func (h *handlers) search(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	query := &hub.Query{
		Text: r.FormValue("q"),
	}
	jsonData, err := h.hubApi.SearchPackages(r.Context(), query)
	if err != nil {
		log.Error().Err(err).Str("query", query.Text).Msg("search failed")
		http.Error(w, "", http.StatusInternalServerError)
	}
	renderJSON(w, jsonData)
}

func (h *handlers) getPackage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	packageID := ps.ByName("package_id")
	jsonData, err := h.hubApi.GetPackageJSON(r.Context(), packageID)
	if err != nil {
		log.Error().Err(err).Str("packageID", packageID).Msg("getPackage failed")
		http.Error(w, "", http.StatusInternalServerError)
	}
	renderJSON(w, jsonData)
}

func (h *handlers) getPackageVersion(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	packageID := ps.ByName("package_id")
	version := ps.ByName("version")
	jsonData, err := h.hubApi.GetPackageVersionJSON(r.Context(), packageID, version)
	if err != nil {
		log.Error().Err(err).
			Str("packageID", packageID).
			Str("version", version).
			Msg("getPackageVersion failed")
		http.Error(w, "", http.StatusInternalServerError)
	}
	renderJSON(w, jsonData)
}

func panicHandler(w http.ResponseWriter, r *http.Request, err interface{}) {
	log.Error().
		Str("method", r.Method).
		Str("url", r.URL.String()).
		Bytes("stacktrace", debug.Stack()).
		Msgf("%v", err)
	w.WriteHeader(http.StatusInternalServerError)
}

func accessHandler() func(http.Handler) http.Handler {
	return hlog.AccessHandler(func(r *http.Request, status, size int, duration time.Duration) {
		log.Debug().
			Str("method", r.Method).
			Str("url", r.URL.String()).
			Int("status", status).
			Int("size", size).
			Float64("duration", duration.Seconds()).
			Msg("request processed")
	})
}

func renderJSON(w http.ResponseWriter, jsonData []byte) {
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonData)
}