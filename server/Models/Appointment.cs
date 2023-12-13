namespace tms.Models
{
  public class Appointment
  {
    public int AppointmentId { get; set; }
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public int DiseaseId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public bool IsCompleted { get; set; }

    public Patient? Patient { get; set; }
    public Doctor? Doctor { get; set; }
    public Disease? Disease { get; set; }
  }
}