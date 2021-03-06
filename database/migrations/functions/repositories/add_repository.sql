-- add_repository adds the provided repository to the database.
create or replace function add_repository(
    p_user_id uuid,
    p_org_name text,
    p_repository jsonb
) returns void as $$
declare
    v_owner_user_id uuid;
    v_owner_organization_id uuid;
begin
    if p_org_name <> '' then
        if not user_belongs_to_organization(p_user_id, p_org_name) then
            raise insufficient_privilege;
        end if;
        v_owner_organization_id = (select organization_id from organization where name = p_org_name);
    else
        v_owner_user_id = p_user_id;
    end if;

    insert into repository (
        name,
        display_name,
        url,
        repository_kind_id,
        user_id,
        organization_id
    ) values (
        p_repository->>'name',
        nullif(p_repository->>'display_name', ''),
        p_repository->>'url',
        (p_repository->>'kind')::int,
        v_owner_user_id,
        v_owner_organization_id
    );
end
$$ language plpgsql;
