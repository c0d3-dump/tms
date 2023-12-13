using tms.Data;
using tms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace tms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class DoctorsController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetDoctors()
    {
      return Ok(await database.Doctors.ToListAsync());
    }

    [HttpGet]
    [Route("{doctorId:int}")]
    public async Task<IActionResult> GetDoctor([FromRoute] int doctorId)
    {
      var doctor = await database.Doctors.FindAsync(doctorId);

      if (doctor == null)
      {
        return NotFound();
      }
      return Ok(doctor);
    }

    [HttpPost]
    public async Task<IActionResult> AddDoctor(AddDoctorRequest addDoctorRequest)
    {
      var newDoctor = new Doctor()
      {
        Name = addDoctorRequest.Name,
        Speciality = addDoctorRequest.Speciality
      };

      await database.Doctors.AddAsync(newDoctor);
      await database.SaveChangesAsync();

      return Ok(newDoctor);
    }

    [HttpDelete]
    [Route("{doctorId:int}")]
    public async Task<IActionResult> DeleteDoctor([FromRoute] int doctorId)
    {

      var doctor = await database.Doctors.FindAsync(doctorId);
      if (doctor != null)
      {
        database.Remove(doctor);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}