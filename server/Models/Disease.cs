namespace tms.Models
{
  public class Disease
  {
    public int DiseaseId { get; set; }
    public required string Name { get; set; }
    public required string Symptoms { get; set; }
  }
}