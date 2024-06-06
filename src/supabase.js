const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://zfchthteqysetyrbgjky.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmY2h0aHRlcXlzZXR5cmJnamt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2NTg2MjcsImV4cCI6MjAzMzIzNDYyN30.73cUvyyz6KgW0ji6xfQghvj9Kre5g-TDd6HiYj7QOYM"
);

module.exports = { supabase };
