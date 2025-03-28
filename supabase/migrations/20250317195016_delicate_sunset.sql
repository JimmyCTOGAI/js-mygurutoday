/*
  # Add default sections trigger

  1. Changes
    - Create a function to add default sections when a new user signs up
    - Create a trigger to automatically call this function on user creation

  2. Default Sections
    - Personal (Purple)
    - Work (Blue)
    - Ideas (Green)
    - Goals (Orange)
*/

-- Function to create default sections for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.sections (user_id, name, description, color)
  VALUES
    (NEW.id, 'Personal', 'Private thoughts and reflections', '#8B5CF6'),
    (NEW.id, 'Work', 'Professional notes and tasks', '#3B82F6'),
    (NEW.id, 'Ideas', 'Creative thoughts and inspirations', '#10B981'),
    (NEW.id, 'Goals', 'Aspirations and objectives', '#F97316');
  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();