
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can select admin_settings" ON public.admin_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can update admin_settings" ON public.admin_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can insert admin_settings" ON public.admin_settings FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default pricing config
INSERT INTO public.admin_settings (key, value) VALUES 
  ('offer_pricing', '{"Visibilité": 297, "Autorité": 497, "Conversion": 797}'::jsonb),
  ('auto_suspension', '{"enabled": true, "delay_days": 15}'::jsonb);

-- Add DB function to auto-check payment statuses
CREATE OR REPLACE FUNCTION public.check_payment_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  suspension_config jsonb;
  delay_days int;
  suspension_enabled boolean;
BEGIN
  -- Get auto-suspension config
  SELECT value INTO suspension_config FROM admin_settings WHERE key = 'auto_suspension';
  suspension_enabled := COALESCE((suspension_config->>'enabled')::boolean, true);
  delay_days := COALESCE((suspension_config->>'delay_days')::int, 15);

  -- Mark subscriptions as 'retard' if next_payment_at is past and currently 'a_jour'
  UPDATE client_subscriptions
  SET payment_status = 'retard', updated_at = now()
  WHERE payment_type = 'abonnement'
    AND payment_status = 'a_jour'
    AND next_payment_at IS NOT NULL
    AND next_payment_at < now();

  -- Auto-suspend if enabled and overdue by more than delay_days
  IF suspension_enabled THEN
    UPDATE client_subscriptions
    SET payment_status = 'suspendu', updated_at = now()
    WHERE payment_type = 'abonnement'
      AND payment_status IN ('retard', 'impaye')
      AND next_payment_at IS NOT NULL
      AND next_payment_at < (now() - (delay_days || ' days')::interval);
  END IF;
END;
$$;
