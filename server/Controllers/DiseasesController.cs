using tms.Data;
using tms.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace tms.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class DiseasesController(Database database) : Controller
  {
    private readonly Database database = database;

    [HttpGet]
    public async Task<IActionResult> GetDiseases()
    {
      return Ok(await database.Diseases.ToListAsync());
    }

    [HttpGet]
    [Route("{diseaseId:int}")]
    public async Task<IActionResult> GetDisease([FromRoute] int diseaseId)
    {
      var disease = await database.Diseases.FindAsync(diseaseId);

      if (disease == null)
      {
        return NotFound();
      }
      return Ok(disease);
    }

    [HttpPost]
    public async Task<IActionResult> AddDisease(AddDiseaseRequest addDiseaseRequest)
    {
      var newDisease = new Disease()
      {
        Name = addDiseaseRequest.Name,
        Symptoms = addDiseaseRequest.Symptoms
      };

      await database.Diseases.AddAsync(newDisease);
      await database.SaveChangesAsync();

      return Ok(newDisease);
    }

    [HttpDelete]
    [Route("{diseaseId:int}")]
    public async Task<IActionResult> DeleteDisease([FromRoute] int diseaseId)
    {

      var disease = await database.Diseases.FindAsync(diseaseId);
      if (disease != null)
      {
        database.Remove(disease);
        await database.SaveChangesAsync();
        return Ok();
      }

      return NotFound();
    }
  }
}