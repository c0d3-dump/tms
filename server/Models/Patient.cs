namespace tms.Models
{
  public class Patient
  {
    public int PatientId { get; set; }
    public required string Name { get; set; }
    public required string PhoneNumber { get; set; }
    public required DateTime BirthDate { get; set; }
  }
}