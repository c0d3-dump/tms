namespace tms.Models
{
  public class AddPatientRequest
  {
    public required string Name { get; set; }
    public required string PhoneNumber { get; set; }
    public required DateTime BirthDate { get; set; }
  }
}