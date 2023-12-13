namespace tms.Models
{
  public class Doctor
  {
    public int DoctorId { get; set; }
    public required string Name { get; set; }
    public required string Speciality { get; set; }
  }
}