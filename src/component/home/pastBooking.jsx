import React, { useState, useEffect } from "react";
import { db } from "../helper/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function PastBooking() {
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    const fetchPastBookings = async () => {
      try {
        const pastBookingsRef = doc(
          collection(db, "pastBookings"),
          localStorage.getItem("uid")
        );
        const pastBookingsSnapshot = await getDoc(pastBookingsRef);
        const data = pastBookingsSnapshot.data();
        if (data && data.bookings) {
          setPastBookings(data.bookings);
        }
      } catch (error) {
        console.error("Error fetching past bookings:", error);
      }
    };

    fetchPastBookings();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString(); 
  };

  return (
    <div className="pastBooking">
      <h2>Past Bookings</h2>
      <ul>
        {pastBookings.map((booking, index) => (
          <li key={index}>
            <p>Slot: {booking.slot}</p>
            <p>Discharge Time: {formatTimestamp(booking.dischargeTime)}</p>
            <p>Arrival Time: {new Date(booking.timestamp).toLocaleString([], { month: 'numeric', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PastBooking;
