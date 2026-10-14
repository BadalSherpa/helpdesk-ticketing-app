let lastGeneratedNumber = 1000;

function generateTicketId(tickets) {
  const highestExistingNumber = tickets.reduce((max, ticket) => {
    const match = ticket.id.match(/^TKT-(\d+)$/);

    if (!match) {
      return max;
    }

    return Math.max(max, Number(match[1]));
  }, 1000);

  lastGeneratedNumber = Math.max(lastGeneratedNumber, highestExistingNumber);

  lastGeneratedNumber += 1;

  return `TKT-${lastGeneratedNumber}`;
}

module.exports = { generateTicketId };
