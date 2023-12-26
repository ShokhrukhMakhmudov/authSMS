const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://hxbarfgaupfbalfjdgur.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4YmFyZmdhdXBmYmFsZmpkZ3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyMzg4MzQsImV4cCI6MjAxMTgxNDgzNH0.ipewVNgADpzMAvfDFMrkMw2Bqw1qJB6UvpYiR5-XM8Q"
);

module.exports = { supabase };
