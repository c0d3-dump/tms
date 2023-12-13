using tms.Models;
using Microsoft.EntityFrameworkCore;

namespace tms.Data
{
  public class Database(DbContextOptions options) : DbContext(options)
  {
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Disease> Diseases { get; set; }
  }
}