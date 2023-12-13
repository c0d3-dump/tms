namespace tms.Models
{
  public class AddAppointmentRequest
  {
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public int DiseaseId { get; set; }
    public DateTime AppointmentDate { get; set; }
  }
}