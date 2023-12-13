using tms.Data;
using tms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace tms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AppointmentsController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetAppointments()
    {
      return Ok(await database.Appointments.Include(a => a.Disease).Include(a => a.Doctor).Include(a => a.Patient).ToListAsync());
    }

    [HttpGet]
    [Route("{appointmentId:int}")]
    public async Task<IActionResult> GetAppointment([FromRoute] int appointmentId)
    {
      var appointment = await database.Appointments.FindAsync(appointmentId);

      if (appointment == null)
      {
        return NotFound();
      }
      return Ok(appointment);
    }

    [HttpPost]
    public async Task<IActionResult> AddAppointment(AddAppointmentRequest addAppointmentRequest)
    {
      var newAppointment = new Appointment()
      {
        DiseaseId = addAppointmentRequest.DiseaseId,
        PatientId = addAppointmentRequest.PatientId,
        DoctorId = addAppointmentRequest.DoctorId,
        AppointmentDate = addAppointmentRequest.AppointmentDate,
        IsCompleted = false
      };

      await database.Appointments.AddAsync(newAppointment);
      await database.SaveChangesAsync();

      return Ok(newAppointment);
    }

    [HttpPut]
    [Route("{appointmentId:int}")]
    public async Task<IActionResult> UpdateAppointment([FromRoute] int appointmentId)
    {
      var appointment = await database.Appointments.FindAsync(appointmentId);

      if (appointment != null)
      {
        appointment.IsCompleted = true;

        await database.SaveChangesAsync();
        return Ok(appointment);
      }
      return NotFound();
    }

    [HttpDelete]
    [Route("{appointmentId:int}")]
    public async Task<IActionResult> DeleteAppointment([FromRoute] int appointmentId)
    {

      var appointment = await database.Appointments.FindAsync(appointmentId);
      if (appointment != null)
      {
        database.Remove(appointment);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}