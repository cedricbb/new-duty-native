# Sécurité à renforcer avant production

## Policies à modifier
- [ ] `families` : Restreindre SELECT aux membres uniquement
- [ ] `families` : Limiter UPDATE au créateur ou admins
- [ ] `families` : Limiter DELETE au créateur uniquement

## À vérifier
- [ ] Tester les policies avec plusieurs familles
- [ ] Vérifier qu'un user ne peut pas accéder aux données d'une autre famille
- [ ] Rate limiting sur la création de familles

## Références
- Policies SQL dans `supabase/policies.sql`
- Doc Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security