using DndDashboard.Api.Helper;
using Microsoft.AspNetCore.Mvc;
using DndDashboard.Domain.Models;
using DndDashboard.Domain.Services;

namespace DndDashboard.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionController(ISessionStore sessionStore) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<Session>> Pull(string id)
    {
        var session = await sessionStore.GetSessionAsync(id);
        if (session is null) 
            return NotFound();
        
        return Ok(session);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Push(string id, [FromBody] Session session)
    {
        var existingSession = await sessionStore.GetSessionAsync(id);
        if (existingSession is null)
            return NotFound();

        session.Id = id; 
        session.UpdatedAt = DateTime.UtcNow;
        await sessionStore.SaveSessionAsync(session);
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] string partyName)
    {
        if (string.IsNullOrWhiteSpace(partyName))
            return BadRequest("Party name cannot be empty.");

        var session = new Session
        {
            Id = GenerateId.Create(),
            PartyName = partyName,
            Players = []
        };
    
        await sessionStore.SaveSessionAsync(session);
        return CreatedAtAction(nameof(Pull), new { id = session.Id }, session.Id);
    }

}