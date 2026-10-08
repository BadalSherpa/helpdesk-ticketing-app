const express = require('express');
const cors = require('cors');
//port configuration
const PORT = process.env.PORT || 5000;

const tickets = require("./data/ticket.js");

//create an instance of express 
//consider app as backend server
const app = express();

app.use(cors());
app.use(express.json());

//get request to the root route
app.get('/', (req, res) => {
  res.json({ message: "Helpdesk API is running"})
});

//get ticket api
app.get('/api/tickets',(req,res)=>{
  
  //server side search 
  const search = req?.query?.search?.toLowerCase().trim() || '';
  let filteredTickets = [...tickets];
  
  if (search) {
    filteredTickets = tickets.filter(ticket => {
      return Object.values(ticket).some(value =>
        String(value).toLowerCase().includes(search)
      );
    });
  }

  //server side status filter
  const status = req.query.status?.trim().toLowerCase() || "";

  let statusFilteredTickets = filteredTickets;

  if (status && status !== 'all') {
    statusFilteredTickets = statusFilteredTickets.filter(ticket => ticket.status?.toLocaleLowerCase() === status);
  }


  // server side sorting

  const sortBy = req.query.sortBy?.trim() || 'createdAt';
  const sortOrder = req.query.sortOrder?.trim().toLowerCase() || 'asc';

  const sortingALlowedFields = ['id', 'subject', 'status', 'createdAt', 'updatedAt'];

  // checks if sorting field exists else default bu createdAt
  const safeSortBy = sortingALlowedFields.includes(sortBy) ? sortBy : 'createdAt';


  statusFilteredTickets.sort((a, b) => {
    const valueA = a[safeSortBy];
    const valueB = b[safeSortBy];

    if(valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }

    if(valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    
    return 0;
  });

   

  //pagination
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  
  const totalTickets = statusFilteredTickets.length;
  const totalPages = Math.ceil(totalTickets / pageSize);


  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
 

  const paginatedTickets = statusFilteredTickets.slice(startIndex, endIndex);

  res.json({
    data: paginatedTickets,
    meta: {
      page,
      pageSize,
      totalTickets,
      totalPages
    }
  })
});


//start the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})