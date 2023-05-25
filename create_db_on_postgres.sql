CREATE TABLE usertype (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(name) > 3)
);

INSERT INTO usertype (name) VALUES ('driver');
INSERT INTO usertype (name) VALUES ('passenger');

CREATE TABLE profile (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users,
  name VARCHAR(150) NOT NULL DEFAULT 'NAME' CHECK (name ~ '^[A-Za-z]{3,}(\s[A-Za-z]+)*$'),
  phone VARCHAR(10) UNIQUE DEFAULT NULL CHECK (phone ~ '^[0-9]{10}$'),
  rating REAL NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  usagetime INT NOT NULL DEFAULT 0 CHECK (usagetime >= 0),
  debt MONEY NOT NULL DEFAULT MONEY(0) CHECK (debt >= MONEY(0)),
  idimage VARCHAR(50) DEFAULT NULL,
  idusertype SMALLINT DEFAULT NULL REFERENCES usertype,
  idstripe VARCHAR DEFAULT NULL
);

CREATE TABLE vehicle (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  model VARCHAR(50) NOT NULL DEFAULT 'MODEL' CHECK (CHAR_LENGTH(model) >= 2),
  brand VARCHAR(50) NOT NULL DEFAULT 'BRAND' CHECK (CHAR_LENGTH(brand) >= 2),
  year INTEGER NOT NULL DEFAULT 1900 CHECK (year >= 1900),
  licenseplate VARCHAR(11) UNIQUE CHECK (licenseplate ~ '^[A-Z0-9]{1,4}(-[A-Z0-9]{1,4}){1,2}$')
);

CREATE TABLE driver (
  id UUID PRIMARY KEY REFERENCES auth.users,
  drivinglicense VARCHAR(12) UNIQUE DEFAULT NULL CHECK (drivinglicense ~ '^[A-Za-z0-9]{12}$'),
  city VARCHAR(150) NOT NULL DEFAULT 'city' CHECK (city ~ '^[A-Za-z]{3,}(\s[A-Za-z]+)*$'),
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

INSERT INTO servicetype (name, price) VALUES ('clásico', 50.0);
INSERT INTO servicetype (name, price) VALUES ('emergencia', 60.0);

CREATE TABLE paymentmethodtype (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(name) > 3)
);

INSERT INTO paymentmethodtype (name) VALUES ('tarjeta');
INSERT INTO paymentmethodtype (name) VALUES ('efectivo');

CREATE TABLE tripstatus (
  id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL CHECK (CHAR_LENGTH(name) > 3)
);

INSERT INTO tripstatus (name) VALUES ('Draft');
INSERT INTO tripstatus (name) VALUES ('Pending');
INSERT INTO tripstatus (name) VALUES ('Confirmed');
INSERT INTO tripstatus (name) VALUES ('Arrived');
INSERT INTO tripstatus (name) VALUES ('Started');
INSERT INTO tripstatus (name) VALUES ('Completed');
INSERT INTO tripstatus (name) VALUES ('Cancelled');

CREATE TABLE trip (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name_startingpoint VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(name_startingpoint) > 3),
  name_endpoint VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(name_endpoint) > 3),
  startingpoint GEOGRAPHY(POINT) NOT NULL,
  endpoint GEOGRAPHY(POINT) NOT NULL,
  done_on TIMESTAMPTZ DEFAULT NOW(),
  took INTERVAL NOT NULL DEFAULT '0 seconds'::INTERVAL CHECK (took >= '0 seconds'::INTERVAL),
  children SMALLINT NOT NULL DEFAULT 0 CHECK (children >= 0 AND children <= 3),
  cost MONEY NOT NULL DEFAULT MONEY(0) CHECK (cost >= MONEY(0)),
  idpassenger UUID NOT NULL REFERENCES passenger,
  iddriver UUID REFERENCES driver,
  idstatus SMALLINT REFERENCES tripstatus,
  idservicetype SMALLINT REFERENCES servicetype,
  idpaymentmethodtype SMALLINT REFERENCES paymentmethodtype
);

--Enable RLS on all tables; 
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE usertype ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE passenger ENABLE ROW LEVEL SECURITY;
ALTER TABLE report ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicetype ENABLE ROW LEVEL SECURITY;
ALTER TABLE paymentmethodtype ENABLE ROW LEVEL SECURITY;
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

CREATE POLICY "Payment method types are viawable by everyone"
  ON paymentmethodtype FOR SELECT TO authenticated
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

CREATE POLICY "Trips with status draft, pending and confirmed are viewable by drivers" 
  ON trip FOR SELECT TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM driver WHERE id = auth.uid())
    AND idstatus < 4
  );

CREATE POLICY "Trips are updated by users who made them" 
  ON trip FOR UPDATE TO authenticated 
  USING (
    auth.uid() = idpassenger OR auth.uid() = iddriver
  );

CREATE POLICY "Trips with status draft, pending and confirmed are updated by drivers" 
  ON trip FOR UPDATE TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM driver WHERE id = auth.uid())
    AND idstatus < 4
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

--Functions and Triggers
CREATE OR REPLACE FUNCTION public."getTrips"(rowsToShow INTEGER) 
RETURNS TABLE (
  id BIGINT,
  name_startingpoint VARCHAR,
  name_endpoint VARCHAR,
  startingpoint TEXT,
  endpoint TEXT,
  done_on TIMESTAMPTZ,
  took INTERVAL,
  children SMALLINT,
  cost MONEY,
  idpassenger UUID,
  iddriver UUID,
  idstatus SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    trip.id,
    trip.name_startingpoint,
    trip.name_endpoint,
    REGEXP_REPLACE(st_astext(trip.startingpoint), '[^0-9\.\s-]','','g') as startingpoint,
    REGEXP_REPLACE(st_astext(trip.endpoint), '[^0-9\.\s-]','','g') as endpoint,
    trip.done_on,
    trip.took,
    trip.children,
    trip.cost,
    trip.idpassenger,
    trip.iddriver,
    trip.idstatus
  FROM trip
  ORDER BY trip.done_on DESC
  LIMIT rowsToShow;

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."getNearbyTrips"(long float, lat float, range float)
RETURNS TABLE (
  id BIGINT,
  name_startingpoint VARCHAR,
  name_endpoint VARCHAR,
  startingpoint TEXT,
  endpoint TEXT,
  done_on TIMESTAMPTZ,
  took INTERVAL,
  children SMALLINT,
  cost MONEY,
  idpassenger UUID,
  iddriver UUID,
  idstatus SMALLINT,
  idservicetype SMALLINT,
  idpaymentmethodtype SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    trip.id,
    trip.name_startingpoint,
    trip.name_endpoint,
    REGEXP_REPLACE(st_astext(trip.startingpoint), '[^0-9\.\s-]','','g') as startingpoint,
    REGEXP_REPLACE(st_astext(trip.endpoint), '[^0-9\.\s-]','','g') as endpoint,
    trip.done_on,
    trip.took,
    trip.children,
    trip.cost,
    trip.idpassenger,
    trip.iddriver,
    trip.idstatus,
    trip.idservicetype,
    trip.idpaymentmethodtype
  FROM trip
  WHERE st_distance(trip.startingpoint, st_point(long, lat)::geography) < range;

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."getStats" (
  IN userid UUID,
  OUT total_cost MONEY,
  OUT trip_count INTEGER,
  OUT debt MONEY,
  OUT profile_id UUID
) AS $$
BEGIN
IF (SELECT idusertype FROM profile WHERE profile.id = userid) = 1 THEN 
  SELECT SUM(cost) INTO total_cost
    FROM trip
   WHERE iddriver = userid;

    SELECT COUNT(*) INTO trip_count
    FROM trip
   WHERE iddriver = userid;

     SELECT profile.debt INTO debt
    FROM profile
   WHERE id = userid;

ELSE 
  SELECT  SUM(cost) INTO total_cost
    FROM trip
   WHERE idpassenger = userid;

    SELECT COUNT(*) INTO trip_count
    FROM trip
   WHERE idpassenger = userid;

     SELECT profile.debt INTO debt
    FROM profile
   WHERE id = userid;
END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."getVehicleFromIdDriver"(iddriver UUID)
RETURNS SETOF vehicle AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM vehicle
  WHERE id = (
    SELECT idvehicle FROM driver WHERE id = iddriver
  );

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."equalPassword" (passwordToValidate VARCHAR)
RETURNS boolean AS $$
BEGIN
  IF EXISTS ( 
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid()
    AND encrypted_password = crypt(passwordToValidate, encrypted_password)) 
  THEN
    RETURN TRUE;
  ELSE 
    RETURN FALSE;  
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public."getTripsToday"(rowsToShow INTEGER) 
RETURNS TABLE (
  id BIGINT,
  name_startingpoint VARCHAR,
  name_endpoint VARCHAR,
  startingpoint TEXT,
  endpoint TEXT,
  done_on TIMESTAMPTZ,
  took INTERVAL,
  children SMALLINT,
  cost MONEY,
  idpassenger UUID,
  iddriver UUID,
  idstatus SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    trip.id,
    trip.name_startingpoint,
    trip.name_endpoint,
    REGEXP_REPLACE(st_astext(trip.startingpoint), '[^0-9\.\s-]','','g') as startingpoint,
    REGEXP_REPLACE(st_astext(trip.endpoint), '[^0-9\.\s-]','','g') as endpoint,
    trip.done_on,
    trip.took,
    trip.children,
    trip.cost,
    trip.idpassenger,
    trip.iddriver,
    trip.idstatus
  FROM trip
  WHERE date(trip.done_on) = current_date
  ORDER BY trip.done_on DESC
  LIMIT rowsToShow;
  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."getTripsThisWeek"(rowsToShow INTEGER) 
RETURNS TABLE (
  id BIGINT,
  name_startingpoint VARCHAR,
  name_endpoint VARCHAR,
  startingpoint TEXT,
  endpoint TEXT,
  done_on TIMESTAMPTZ,
  took INTERVAL,
  children SMALLINT,
  cost MONEY,
  idpassenger UUID,
  iddriver UUID,
  idstatus SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    trip.id,
    trip.name_startingpoint,
    trip.name_endpoint,
    REGEXP_REPLACE(st_astext(trip.startingpoint), '[^0-9\.\s-]','','g') as startingpoint,
    REGEXP_REPLACE(st_astext(trip.endpoint), '[^0-9\.\s-]','','g') as endpoint,
    trip.done_on,
    trip.took,
    trip.children,
    trip.cost,
    trip.idpassenger,
    trip.iddriver,
    trip.idstatus
  FROM trip
  WHERE date_part('year', trip.done_on) = date_part('year', CURRENT_DATE) 
  AND date_part('week', trip.done_on ) = date_part('week', CURRENT_TIMESTAMP)
  ORDER BY trip.done_on DESC 
  LIMIT rowsToShow;

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."getTripsThisMonth"(rowsToShow INTEGER) 
RETURNS TABLE (
  id BIGINT,
  name_startingpoint VARCHAR,
  name_endpoint VARCHAR,
  startingpoint TEXT,
  endpoint TEXT,
  done_on TIMESTAMPTZ,
  took INTERVAL,
  children SMALLINT,
  cost MONEY,
  idpassenger UUID,
  iddriver UUID,
  idstatus SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    trip.id,
    trip.name_startingpoint,
    trip.name_endpoint,
    REGEXP_REPLACE(st_astext(trip.startingpoint), '[^0-9\.\s-]','','g') as startingpoint,
    REGEXP_REPLACE(st_astext(trip.endpoint), '[^0-9\.\s-]','','g') as endpoint,
    trip.done_on,
    trip.took,
    trip.children,
    trip.cost,
    trip.idpassenger,
    trip.iddriver,
    trip.idstatus
  FROM trip
  WHERE date_part('year', trip.done_on) = date_part('year', CURRENT_DATE)
  AND date_part('month', trip.done_on ) = date_part('month', CURRENT_TIMESTAMP)
  ORDER BY trip.done_on DESC
  LIMIT rowsToShow;

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."getTripsThisYear"(rowsToShow INTEGER) 
RETURNS TABLE (
  id BIGINT,
  name_startingpoint VARCHAR,
  name_endpoint VARCHAR,
  startingpoint TEXT,
  endpoint TEXT,
  done_on TIMESTAMPTZ,
  took INTERVAL,
  children SMALLINT,
  cost MONEY,
  idpassenger UUID,
  iddriver UUID,
  idstatus SMALLINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    trip.id,
    trip.name_startingpoint,
    trip.name_endpoint,
    REGEXP_REPLACE(st_astext(trip.startingpoint), '[^0-9\.\s-]','','g') as startingpoint,
    REGEXP_REPLACE(st_astext(trip.endpoint), '[^0-9\.\s-]','','g') as endpoint,
    trip.done_on,
    trip.took,
    trip.children,
    trip.cost,
    trip.idpassenger,
    trip.iddriver,
    trip.idstatus
  FROM trip
  WHERE date_part('year', trip.done_on) = date_part('year', CURRENT_DATE)
  ORDER BY trip.done_on DESC
  LIMIT rowsToShow;

  RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public."emailExists"(emailToEvaluate VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE auth.users.email = emailToEvaluate) THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."phoneExists"(phoneToEvaluate VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM profile WHERE phone = phoneToEvaluate) THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."licensePlateExists"(licenseplateToEvaluate VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM vehicle WHERE licenseplate = licenseplateToEvaluate) THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."drivingLicenseExists"(drivinglicenseToEvaluate VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM driver WHERE drivinglicense = drivinglicenseToEvaluate) THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."completePassengerProfile" (
  profileToUpdate UUID,
  newname VARCHAR,
  newphone VARCHAR,
  newemergencyphone VARCHAR
)
RETURNS void AS $$
BEGIN
  IF profileToUpdate IS NULL THEN
    RAISE EXCEPTION 'Need to specify a ID';  
  END IF;

  IF EXISTS (SELECT 1 FROM profile WHERE id = profileToUpdate AND idusertype IS NULL) THEN
    
    UPDATE profile
    SET
      name = newname,
      phone = newphone,
      idusertype = (SELECT id FROM usertype WHERE name = 'passenger')
    WHERE id = profileToUpdate;

    UPDATE passenger
    SET
      emergencyphone = newemergencyphone
    WHERE id = profileToUpdate;

  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION public."completeDriverProfile" (
  profileToUpdate UUID, 
  newname VARCHAR, 
  newphone VARCHAR,
  newdrivinglicense VARCHAR,
  newcity VARCHAR,
  newmodel VARCHAR,
  newbrand VARCHAR,
  newyear INTEGER,
  newlicenseplate VARCHAR
)
RETURNS void AS $$
BEGIN
  IF profileToUpdate IS NULL THEN
    RAISE EXCEPTION 'Need to specify a ID';
  END IF;

  IF EXISTS (SELECT 1 FROM profile WHERE id = profileToUpdate AND idusertype IS NULL) THEN

    UPDATE profile
    SET 
      name = newname, 
      phone = newphone, 
      idusertype = (SELECT id FROM usertype WHERE name = 'driver') 
    WHERE id = profileToUpdate;

    UPDATE driver
    SET
      drivinglicense = newdrivinglicense,
      city = newcity
    WHERE id = profileToUpdate;

    UPDATE vehicle
    SET
      model = newmodel,
      brand = newbrand,
      year = newyear,
      licenseplate = newlicenseplate
    WHERE id = (SELECT idvehicle FROM driver WHERE driver.id = profileToUpdate);

  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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