const initialTravellers = [
  {
    id: 1,
    name: "Jack",
    phone: 88885555,
    bookingTime: new Date(),
  },
  {
    id: 2,
    name: "Rose",
    phone: 88884444,
    bookingTime: new Date(),
  },
];

function TravellerRow({ traveller }) {
  return (
    <tr>
      <td>{traveller.id}</td>
      <td>{traveller.name}</td>
      <td>{traveller.phone}</td>
      <td>{traveller.bookingTime.toLocaleString()}</td>
    </tr>
  );
}

function Display({ travellers }) {
  return (
    <table className='bordered-table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Booking Time</th>
        </tr>
      </thead>
      <tbody>
        {travellers.map((traveller) => (
          <TravellerRow key={traveller.id} traveller={traveller} />
        ))}
      </tbody>
    </table>
  );
}

function Add({ bookTraveller }) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTraveller = {
      id: Date.now(), // Unique ID
      name,
      phone: parseInt(phone),
      bookingTime: new Date(),
    };
    bookTraveller(newTraveller);
    setName("");
    setPhone("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='travellername'
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type='text'
        name='travellerphone'
        placeholder='Phone'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type='submit'>Add</button>
    </form>
  );
}

function Delete({ deleteTraveller }) {
  const [id, setId] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteTraveller(id);
    setId("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='number'
        name='travellerid'
        placeholder='Traveller Id'
        value={id}
        onChange={(e) => setId(Number.parseInt(e.target.value))}
      />
      <button type='submit'>Delete</button>
    </form>
  );
}

function Homepage() {
  // Simulated visual representation of free seats
  return (
    <div>
      <h2>Visual Representation of Free Seats</h2>
      {/* Placeholder to visually represent free seats */}
    </div>
  );
}

function TicketToRide() {
  const [travellers, setTravellers] = React.useState(initialTravellers);
  const [selector, setSelector] = React.useState(1);
  const [incrementingId, setIncrementingId] = React.useState(travellers.length);

  const bookTraveller = (newTraveller) => {
    const traveller = makeNewTraveller(newTraveller.name, newTraveller.phone);
    setTravellers((prevTravellers) => [...prevTravellers, traveller]);
    setIncrementingId((prevId) => prevId + 1);
  };

  const deleteTraveller = (idToDelete) => {
    console.log(travellers);
    if (!travellers.some((traveller) => traveller.id === idToDelete)) {
      alert("Traveller not found");
      return;
    }
    setTravellers((prevTravellers) =>
      prevTravellers.filter((traveller) => traveller.id !== idToDelete)
    );
    alert("Traveller deleted");
  };

  const makeNewTraveller = (name, phone) => {
    return {
      id: incrementingId + 1, // Unique ID
      name,
      phone: parseInt(phone),
      bookingTime: new Date(),
    };
  };
  return (
    <div>
      <h1>Ticket To Ride</h1>
      <div>
        {/* Navigation bar */}
        <button onClick={() => setSelector(1)}>Homepage</button>
        <button onClick={() => setSelector(2)}>View Travellers</button>
        <button onClick={() => setSelector(3)}>Add Traveller</button>
        <button onClick={() => setSelector(4)}>Delete Traveller</button>
      </div>
      <div>
        {/* Conditionally render based on selected option */}
        {selector === 1 && <Homepage />}
        {selector === 2 && <Display travellers={travellers} />}
        {selector === 3 && <Add bookTraveller={bookTraveller} />}
        {selector === 4 && <Delete deleteTraveller={deleteTraveller} />}
      </div>
    </div>
  );
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById("contents"));
