alter table "auth"."mfa_factors" drop constraint "mfa_factors_phone_key";

drop index if exists "auth"."mfa_factors_phone_key";

drop index if exists "auth"."unique_verified_phone_factor";

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


