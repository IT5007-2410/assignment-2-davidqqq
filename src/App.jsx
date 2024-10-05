const initialTravellers = [
  {
    id: 1,
    name: "Jack",
    phone: 88885555,
    bookingTime: new Date(),
    row: 2,
    seat: 1,
  },
  {
    id: 2,
    name: "Rose",
    phone: 88884444,
    bookingTime: new Date(),
    row: 1,
    seat: 1,
  },
];

function TravellerRow({ traveller }) {
  return (
    <tr>
      <td>{traveller.id}</td>
      <td>{traveller.name}</td>
      <td>{traveller.phone}</td>
      <td>{traveller.bookingTime.toLocaleString()}</td>
      <td>{traveller.row}</td>
      <td>{traveller.seat}</td>
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
          <th>Row</th>
          <th>Seat</th>
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

function Add({ bookTraveler }) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [row, setRow] = React.useState("");
  const [seat, setSeat] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTraveler = {
      id: Date.now(), // Unique ID
      name,
      phone: parseInt(phone),
      bookingTime: new Date(),
      row: parseInt(row),
      seat: parseInt(seat),
    };
    bookTraveler(newTraveler);
    setName("");
    setPhone("");
    setRow("");
    setSeat("");
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
      <input
        type='number'
        name='row'
        placeholder='Row'
        value={row}
        onChange={(e) => setRow(e.target.value)}
      />

      <input
        type='number'
        name='seat'
        placeholder='Seat'
        value={seat}
        onChange={(e) => setSeat(e.target.value)}
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

const SEAT_TYPES = {
  EXTRA: "extra",
  FORWARD: "forward",
  STANDARD: "standard",
  AISLE: "aisle",
  EMPTY: "empty",
  OCCUPIED: "occupied",
  SELECTED: "selected",
};
class RowBuilder {
  constructor() {
    this.row = [];
  }

  getRow() {
    return this.row;
  }

  addSeat(seatType, times = 1) {
    for (let i = 0; i < times; i++) {
      this.row.push({
        seatType,
      });
    }
    return this;
  }

  rows(count) {
    return Array(count)
      .fill()
      .map(() => this.row.map((seat) => ({ ...seat })));
  }
}
class SeatsBuilder {
  constructor() {
    this.seats = [];
    this.currentRow = -1;
  }
  addSeat(seatType) {
    this.seats[this.currentRow].push({
      seatType,
    });
  }

  addRow(row) {
    this.seats.push(row);
    this.currentRow += 1;
  }
  addRows(rows) {
    for (let i = 0; i < rows.length; i++) {
      this.addRow(rows[i]);
    }
  }
  getSeats() {
    console.log(this.seats);
    return this.seats;
  }

  buildRow() {
    return new RowBuilder();
  }

  freeSeats() {
    let count = 0;
    for (let i = 0; i < this.seats.length; i++) {
      for (let j = 0; j < this.seats[i].length; j++) {
        if (
          ![SEAT_TYPES.EMPTY, SEAT_TYPES.OCCUPIED, SEAT_TYPES.AISLE].includes(
            this.seats[i][j].seatType
          )
        ) {
          count += 1;
        }
      }
    }
    return count;
  }

  tookSeat(row, seat, traveller) {
    if (
      ![SEAT_TYPES.EMPTY, SEAT_TYPES.OCCUPIED, SEAT_TYPES.AISLE].includes(
        this.seats[row][seat].seatType
      )
    ) {
      this.seats[row][seat].seatType = SEAT_TYPES.OCCUPIED;
      this.seats[row][seat].customer = traveller;
    }
  }
}

const initSeats = (travellers) => {
  const builder = new SeatsBuilder();

  const firstRow = builder
    .buildRow()
    .addSeat(SEAT_TYPES.EXTRA, 2)
    // .addSeat(SEAT_TYPES.AISLE)
    // .addSeat(SEAT_TYPES.EXTRA, 1)
    // .addSeat(SEAT_TYPES.EMPTY, 2)
    // .addSeat(SEAT_TYPES.EXTRA, 1)
    .addSeat(SEAT_TYPES.AISLE)
    .addSeat(SEAT_TYPES.EXTRA, 2);
  const forwardRows = builder
    .buildRow()
    .addSeat(SEAT_TYPES.FORWARD, 2)
    // .addSeat(SEAT_TYPES.AISLE)
    // .addSeat(SEAT_TYPES.FORWARD, 4)
    .addSeat(SEAT_TYPES.AISLE)
    .addSeat(SEAT_TYPES.FORWARD, 2)
    .rows(1);
  const standardRows = builder
    .buildRow()
    .addSeat(SEAT_TYPES.STANDARD, 2)
    // .addSeat(SEAT_TYPES.AISLE)
    // .addSeat(SEAT_TYPES.STANDARD, 4)
    .addSeat(SEAT_TYPES.AISLE)
    .addSeat(SEAT_TYPES.STANDARD, 2)
    .rows(1);
  builder.addRow(firstRow.getRow());
  builder.addRows(forwardRows);
  builder.addRows(standardRows);

  for (const traveller of travellers) {
    builder.tookSeat(traveller.row, traveller.seat, traveller);
    console.log(traveller.id);
  }
  return builder;
};
const SeatLayout = ({ travellers }) => {
  const builder = initSeats(travellers);
  const [rows, setRows] = React.useState(builder.getSeats());
  const [selectedSeat, setSelectedSeat] = React.useState([-1, -1]);
  const [freeSeats, setFreeSeats] = React.useState(builder.freeSeats());
  const handleSeatSelection = (row, seat) => {
    if (
      [SEAT_TYPES.EMPTY, SEAT_TYPES.OCCUPIED, SEAT_TYPES.AISLE].includes(
        rows[row][seat].seatType
      )
    ) {
      return;
    }
    setSelectedSeat([row, seat]);
  };

  return (
    <div className='seat-layout'>
      <div className='free-seats'>
        <h3>Free Seats: {freeSeats}</h3>
      </div>
      <div className='legend'>
        <div className='legend-item extra'>Extra Legroom Seat</div>
        <div className='legend-item forward'>Forward Zone Seat</div>
        <div className='legend-item standard'>Standard Seat</div>
      </div>
      <div className='seats'>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className='seat-row'>
            <div
              style={{
                margin: "auto",
              }}
            >
              {" "}
              {rowIndex + 1}
            </div>
            {row.map((seat, seatIndex) => (
              <div
                key={seatIndex}
                onClick={() => handleSeatSelection(rowIndex, seatIndex)}
              >
                <div
                  className={`seat ${seat.seatType} 
                ${
                  selectedSeat[0] === rowIndex && selectedSeat[1] === seatIndex
                    ? SEAT_TYPES.SELECTED
                    : ""
                } 
                
                `}
                ></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
function Homepage({ travellers }) {
  // Simulated visual representation of free seats
  return (
    <div>
      <h2>Visual Representation of Free Seats</h2>
      {/* Placeholder to visually represent free seats */}
      <SeatLayout travellers={travellers} />
    </div>
  );
}

function TicketToRide() {
  const [travellers, setTravellers] = React.useState(initialTravellers);
  const [selector, setSelector] = React.useState(1);
  const [incrementingId, setIncrementingId] = React.useState(travellers.length);

  const bookTraveler = (newTraveller) => {
    const traveller = makeNewTraveller(
      newTraveller.name,
      newTraveller.phone,
      newTraveller.row,
      newTraveller.seat
    );
    setTravellers((prevTravellers) => [...prevTravellers, traveller]);
    setIncrementingId((prevId) => prevId + 1);
  };

  const deleteTraveller = (idToDelete) => {
    if (!travellers.some((traveller) => traveller.id === idToDelete)) {
      alert("Traveller not found");
      return;
    }
    setTravellers((prevTravellers) =>
      prevTravellers.filter((traveller) => traveller.id !== idToDelete)
    );
    alert("Traveller deleted");
  };

  const makeNewTraveller = (name, phone, row, seat) => {
    return {
      id: incrementingId + 1, // Unique ID
      name,
      phone: parseInt(phone),
      bookingTime: new Date(),
      row: parseInt(row),
      seat: parseInt(seat),
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
        {selector === 1 && <Homepage travellers={travellers} />}
        {selector === 2 && <Display travellers={travellers} />}
        {selector === 3 && <Add bookTraveler={bookTraveler} />}
        {selector === 4 && <Delete deleteTraveller={deleteTraveller} />}
      </div>
    </div>
  );
}

const element = <TicketToRide />;

ReactDOM.render(element, document.getElementById("contents"));
