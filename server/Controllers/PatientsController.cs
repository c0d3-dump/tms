using tms.Data;
using tms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace tms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class PatientsController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetPatients()
    {
      return Ok(await database.Patients.ToListAsync());
    }

    [HttpGet]
    [Route("{patientId:int}")]
    public async Task<IActionResult> GetPatient([FromRoute] int patientId)
    {
      var patient = await database.Patients.FindAsync(patientId);

      if (patient == null)
      {
        return NotFound();
      }
      return Ok(patient);
    }

    [HttpPost]
    public async Task<IActionResult> AddPatient(AddPatientRequest addPatientRequest)
    {
      var newPatient = new Patient()
      {
        Name = addPatientRequest.Name,
        PhoneNumber = addPatientRequest.PhoneNumber,
        BirthDate = addPatientRequest.BirthDate
      };

      await database.Patients.AddAsync(newPatient);
      await database.SaveChangesAsync();

      return Ok(newPatient);
    }

    [HttpDelete]
    [Route("{patientId:int}")]
    public async Task<IActionResult> DeletePatient([FromRoute] int patientId)
    {

      var patient = await database.Patients.FindAsync(patientId);
      if (patient != null)
      {
        database.Remove(patient);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}