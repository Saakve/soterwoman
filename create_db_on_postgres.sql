CREATE TABLE usertype (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(name) > 3)
);

INSERT INTO usertype (name) VALUES ('driver');
INSERT INTO usertype (name) VALUES ('passenger');

CREATE TABLE profile (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users,
  name VARCHAR(50) NOT NULL DEFAULT 'NAME' CHECK (name ~ '^[A-Za-z]{3,}(\s[A-Za-z]+)*$'),
  phone VARCHAR(10) NOT NULL DEFAULT '0000000000' CHECK (phone ~ '^[0-9]{10}$'),
  rating REAL NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  usagetime INT NOT NULL DEFAULT 0 CHECK (usagetime >= 0),
  debt MONEY NOT NULL DEFAULT MONEY(0) CHECK (debt >= MONEY(0)),
  idimage VARCHAR(50) DEFAULT NULL,
  idusertype SMALLINT DEFAULT NULL REFERENCES usertype
);

CREATE TABLE vehicle (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  model VARCHAR(50) NOT NULL DEFAULT 'MODEL' CHECK (CHAR_LENGTH(model) > 2),
  brand VARCHAR(50) NOT NULL DEFAULT 'BRAND' CHECK (CHAR_LENGTH(brand) > 2),
  year INTEGER NOT NULL DEFAULT 1900 CHECK (year > 1900),
  licenseplate VARCHAR(11) CHECK (licenseplate ~ '^[A-Z0-9]{1,4}(-[A-Z0-9]{1,4}){1,2}$')
);

CREATE TABLE driver (
  id UUID PRIMARY KEY REFERENCES auth.users,
  drivinglicense VARCHAR(12) NOT NULL DEFAULT '123456789ACD' CHECK (drivinglicense ~ '^[A-Za-z0-9]{12}$'),
  city VARCHAR(50) NOT NULL DEFAULT 'city' CHECK (CHAR_LENGTH(city) > 3),
  idvehicle INT REFERENCES vehicle
);

CREATE TABLE passenger (
  id UUID PRIMARY KEY REFERENCES auth.users,
  emergencyphone VARCHAR(10) NOT NULL DEFAULT '0000000000' CHECK (emergencyphone ~ '^[0-9]{10}$')
);

CREATE TABLE report (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT NOT NULL DEFAULT '',
  idpassenger UUID NOT NULL REFERENCES passenger,
  iddriver UUID NOT NULL REFERENCES driver
);

CREATE TABLE servicetype (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(name) > 3),
  price MONEY NOT NULL CHECK (price > MONEY(0))
);

CREATE TABLE tripstatus (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(name) > 3)
);

INSERT INTO tripstatus (name) VALUES ('completo');
INSERT INTO tripstatus (name) VALUES ('cancelado');

CREATE TABLE trip (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  startingpoint VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(startingpoint) > 3),
  endpoint VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(endpoint) > 3),
  done_on TIMESTAMPTZ DEFAULT NOW(),
  took INTERVAL NOT NULL DEFAULT '0 seconds'::INTERVAL CHECK (took >= '0 seconds'::INTERVAL),
  children SMALLINT NOT NULL DEFAULT 0 CHECK (children >= 0 AND children <= 3),
  cost MONEY NOT NULL DEFAULT MONEY(0) CHECK (cost >= MONEY(0)),
  idpassenger UUID NOT NULL REFERENCES passenger,
  iddriver UUID NOT NULL REFERENCES driver,
  idstatus SMALLINT REFERENCES tripstatus
);

--Enable RLS on all tables; 
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE usertype ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE passenger ENABLE ROW LEVEL SECURITY;
ALTER TABLE report ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicetype ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip ENABLE ROW LEVEL SECURITY;
ALTER TABLE tripstatus ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "User types are viawable by everyone"
  ON usertype FOR SELECT TO authenticated
  USING (
    true
  );

CREATE POLICY "Trip status are viawable by everyone"
  ON tripstatus FOR SELECT TO authenticated
  USING (
    true
  );

CREATE POLICY "Service types are viawable by everyone"
  ON servicetype FOR SELECT TO authenticated
  USING (
    true
  );

CREATE POLICY "Profiles are viewable by everyone" 
  ON profile FOR SELECT TO authenticated 
  USING (
    true 
  );

CREATE POLICY "Reports are viewable by everyone" 
  ON report FOR SELECT TO authenticated 
  USING (
    true 
  );

CREATE POLICY "Passengers are viewable by everyone" 
  ON passenger FOR SELECT TO authenticated 
  USING (
    true 
  );

CREATE POLICY "Vehicles are viewable by everyone" 
  ON vehicle FOR SELECT TO authenticated 
  USING (
    true
  );

CREATE POLICY "Drivers are viewable by everyone" 
  ON driver FOR SELECT TO authenticated 
  USING (
    true
  );

CREATE POLICY "Trips are viewable by users who made them" 
  ON trip FOR SELECT TO authenticated 
  USING (
    auth.uid() = idpassenger OR auth.uid() = iddriver
  );

CREATE POLICY "Trips are updated by users who made them" 
  ON trip FOR UPDATE TO authenticated 
  USING (
    auth.uid() = idpassenger OR auth.uid() = iddriver
  );

CREATE POLICY "Users can update their own profiles" 
  ON profile FOR UPDATE TO authenticated 
  USING ( 
    auth.uid() = id
  );

CREATE POLICY "Users can update the profile of the person they traveled with" 
  ON profile
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM trip WHERE iddriver = auth.uid() OR idpassenger = auth.uid())
  );

CREATE POLICY "Drivers can update their own driver info" 
  ON driver FOR UPDATE TO authenticated 
  USING ( 
    auth.uid() = id
  );

CREATE POLICY "Drivers can update their own vehicle" 
  ON vehicle FOR UPDATE TO authenticated 
  USING ( 
    EXISTS (SELECT 1 FROM driver WHERE driver.id = auth.uid() AND driver.idvehicle = vehicle.id)
  );

CREATE POLICY "Passengers can update their own passenger info" 
  ON passenger FOR UPDATE TO authenticated 
  USING ( 
    auth.uid() = id
  );

CREATE POLICY "Trips are made by everyone" 
  ON trip FOR INSERT TO authenticated 
  WITH CHECK (
    true
  );

CREATE POLICY "Reports are made only by drivers" 
  ON report FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usertype
      WHERE id = (SELECT idusertype FROM profile WHERE id = auth.uid())
      AND name = 'driver'
    )
    AND EXISTS (
      SELECT 1 FROM driver WHERE id = auth.uid()
    )
  );

CREATE POLICY "Vehicles are made only by drivers" 
  ON vehicle FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usertype
      WHERE id = (SELECT idusertype FROM profile WHERE id = auth.uid())
      AND name = 'driver'
    ) 
    AND EXISTS (
      SELECT 1 FROM driver WHERE id = auth.uid()
    )
  );

-- Bucket Avatars
INSERT INTO storage.buckets (id, name) VALUES ('avatars', 'avatars');

CREATE POLICY "Avatar images are publicly accesible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar"
  ON storage.objects
  FOR INSERT 
  WITH CHECK ( 
    bucket_id = 'avatars'
  );

CREATE POLICY "Anyone can update their own avatar" 
  ON storage.objects
  FOR UPDATE 
  USING ( 
    auth.uid() = owner
  ) 
  WITH CHECK ( 
    bucket_id = 'avatars'
  );

--Triggers.
CREATE FUNCTION public."handle_new_user"()
RETURNS trigger AS $$
DECLARE
  namefromprovider VARCHAR(50);
BEGIN
  SELECT SUBSTRING(NEW."raw_user_meta_data"->>'full_name','([A-Za-z]{3,}(\s[A-Za-z]+)*)') INTO namefromprovider;
  IF namefromprovider IS NOT NULL THEN
    INSERT INTO public.profile (id, name) VALUES (NEW."id", namefromprovider );
  ELSE
    INSERT INTO public.profile (id) VALUES (NEW."id");
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."handle_profile_updated"()
RETURNS trigger AS $$
DECLARE
  usertype VARCHAR(50);
BEGIN
  SELECT name INTO usertype FROM public.usertype WHERE id = NEW.idusertype;
  IF (usertype = 'driver') THEN
    INSERT INTO public."driver" ("id") VALUES (NEW."id");
  ELSIF (usertype = 'passenger') THEN
    INSERT INTO public."passenger" ("id") VALUES (NEW."id");
  END IF;
  RETURN NEW;
  EXCEPTION
    WHEN unique_violation THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."handle_new_driver"()
RETURNS trigger AS $$
DECLARE
  vehicletoinsert INT;
BEGIN
  INSERT INTO vehicle (model, brand) VALUES ('MODEL','BRAND') RETURNING id INTO vehicletoinsert;
  UPDATE driver SET idvehicle = vehicletoinsert WHERE id = NEW."id";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."handle_profile_updated_by_others"()
RETURNS trigger AS $$
DECLARE
  usertype VARCHAR(50);
BEGIN
  IF
    ((OLD.id IS NOT NULL AND NEW.id IS NULL) OR OLD.id <> NEW.id) OR
    ((OLD.name IS NULL AND NEW.name IS NOT NULL) OR (OLD.name IS NOT NULL AND NEW.name IS NULL) OR OLD.name <> NEW.name) OR
    ((OLD.phone IS NULL AND NEW.phone IS NOT NULL) OR (OLD.phone IS NOT NULL AND NEW.phone IS NULL) OR OLD.phone <> NEW.phone) OR
    ((OLD.usagetime IS NULL AND NEW.usagetime IS NOT NULL) OR (OLD.usagetime IS NOT NULL AND NEW.usagetime IS NULL) OR OLD.usagetime <> NEW.usagetime) OR
    ((OLD.debt IS NULL AND NEW.debt IS NOT NULL) OR (OLD.debt IS NOT NULL AND NEW.debt IS NULL) OR OLD.debt <> NEW.debt) OR
    ((OLD.idimage IS NULL AND NEW.idimage IS NOT NULL) OR (OLD.idimage IS NOT NULL AND NEW.idimage IS NULL) OR OLD.idimage <> NEW.idimage) OR
    ((OLD.idusertype IS NULL AND NEW.idusertype IS NOT NULL) OR (OLD.idusertype IS NOT NULL AND NEW.idusertype IS NULL) OR OLD.idusertype <> NEW.idusertype)
  THEN
    RAISE EXCEPTION 'User only can update rating';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER on_profile_updated
  AFTER UPDATE ON public.profile
  FOR EACH ROW
  WHEN ((OLD.idusertype IS NULL AND NEW.idusertype IS NOT NULL) OR OLD.idusertype <> NEW.idusertype)
  EXECUTE PROCEDURE public.handle_profile_updated();

CREATE TRIGGER on_profile_updated_by_others
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  WHEN (OLD.ID <> auth.uid())
  EXECUTE PROCEDURE public.handle_profile_updated_by_others();

CREATE TRIGGER on_new_driver
  AFTER INSERT ON public.driver
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_driver();