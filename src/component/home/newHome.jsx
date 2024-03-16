import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { db } from "../helper/firebaseConfig";
import "./home.css";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

const Home = () => {
  const [data, setData] = useState(null);
  const [slotStatus, setSlotStatus] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const dialogRef = useRef(null);
  const myUid = localStorage.getItem("uid");
  const userData = localStorage.getItem("userD");
  const parsedData = JSON.parse(userData);
  const [datawa, setDatawa] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://blynk.cloud/external/api/getAll?token=bPLk6gY2q1BDNOU0N1mvOZOoGcGZEUCq"
      );
      setData({ v0: 1, v1: 0, v2: 1 });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSlotStatus = async () => {
    try {
      const slotColl = collection(db, "slots");
      const snapshot = await getDocs(slotColl);
      const status = {};
      const allData = {};
      snapshot.forEach((doc) => {
        status[doc.id] = doc.data().status;
        allData[doc.id] = doc.data();
      });
      setSlotStatus(status);
      setDatawa(allData);
    } catch (error) {
      console.error("Error fetching slot status:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSlotStatus();
    const interval = setInterval(() => {
      fetchData();
      fetchSlotStatus();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getSlotClassName = (slotData, slotStatus) => {
    if (slotData === 1 && slotStatus === "booked") {
      return "ParkBooked";
    } else if (slotData === 1 && slotStatus === "") {
      return "noBookPark";
    } else if (slotData !== 1 && slotStatus === "booked") {
      return "BookedOnly";
    } else {
      return "nullStatus";
    }
  };

  const handleBooking = async (name, vehicleNumber, mobile) => {
    if (!myUid) {
      alert("Please login to prebook a slot!");
      return;
    }

    try {
      const bookingRef = doc(collection(db, "bookings"), myUid);
      const bookingSnapshot = await getDoc(bookingRef);

      if (bookingSnapshot.exists()) {
        alert(
          "You already have a booking. Please return your current booking before booking another slot."
        );
        return;
      }

      await setDoc(bookingRef, {
        slot: selectedSlot,
        name,
        vehicleNumber,
        mobile,
        timestamp: new Date().toISOString(),
      });

      await setDoc(doc(collection(db, "slots"), `${selectedSlot}`), {
        status: "booked",
        userID: myUid,
        timestamp: new Date().toISOString(),
      });

      setSelectedSlot(null);
      setName("");
      setVehicleNumber("");
      setMobile("");
    } catch (error) {
      console.error("Error booking slot:", error);
    }
  };

  const handleReturn = async (slot) => {
    try {
      const myColl = collection(db, "bookings");
      const mydoc = doc(myColl, myUid);
      const myBooking = await getDoc(mydoc);
      const myBookingData = myBooking.data();

      const bookingRef = doc(collection(db, "bookings"), myUid);
      await deleteDoc(bookingRef);

      const slotRef = doc(collection(db, "slots"), slot);
      await setDoc(slotRef, {
        status: "",
        userID: "",
        timestamp: null,
      });

      const pastBookingsCollRef = collection(db, "pastBookings");
      const pastBookingsRef = doc(pastBookingsCollRef, myUid);
      const existingPastBookingsSnapshot = await getDoc(pastBookingsRef);
      const existingPastBookingsData = existingPastBookingsSnapshot.data();
      const existingPastBookings = existingPastBookingsData
        ? existingPastBookingsData.bookings || []
        : [];

      const newBookingData = {
        ...myBookingData,
        dischargeTime: Timestamp.now(),
      };

      const newPastBookings = [...existingPastBookings, newBookingData];

      await setDoc(pastBookingsRef, { bookings: newPastBookings });

      fetchSlotStatus();
      fetchData();

      alert("donee");
    } catch (error) {
      console.error("Error returning slot:", error);
    }
  };

  useEffect(() => {
    if (selectedSlot !== null) {
      dialogRef.current.style.display = "block";
    } else {
      dialogRef.current.style.display = "none";
    }
  }, [selectedSlot]);

  return (
    <section id="slots" className="slots container">
      <h2>Parking Slots</h2>
      <div className="parking container">
        <div
          className={`parking-boc-section ${
            data ? getSlotClassName(data.v0, slotStatus["slot0"]) : "nullStatus"
          }`}>
          <div className="parking-name">Parking 1</div>
          <div className="parking-value">
            {slotStatus["slot0"] === "booked" ? (
              <div>
                {datawa.slot0 && datawa.slot0.userID === myUid ? (

                  <>
                  <button onClick={() => handleReturn("slot0")}>
                    Return Slot
                  </button>
                  </>
                ) : (
                  "Booked"
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!myUid) {
                    alert("Please login to prebook a slot!");
                    return;
                  }
                  setSelectedSlot("slot0");
                }}>
                Book Slot
              </button>
            )}
          </div>

          {datawa.slot0 && datawa.slot0.timestamp}
          
        </div>

        <div
          className={`parking-boc-section ${
            data ? getSlotClassName(data.v1, slotStatus["slot1"]) : "nullStatus"
          }`}>
          <div className="parking-name">Parking 2</div>
          <div className="parking-value">
            {slotStatus["slot1"] === "booked" ? (
              <div>
                {datawa.slot1 && datawa.slot1.userID === myUid ? (
                  <button onClick={() => handleReturn("slot1")}>
                    Return Slot
                  </button>
                ) : (
                  "Booked"
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!myUid) {
                    alert("Please login to prebook a slot!");
                    return;
                  }
                  setSelectedSlot("slot1");
                }}>
                Book Slot
              </button>
            )}
          </div>
          {datawa.slot1 && datawa.slot1.timestamp}

        </div>

        <div
          className={`parking-boc-section ${
            data ? getSlotClassName(data.v2, slotStatus["slot2"]) : "nullStatus"
          }`}>
          <div className="parking-name">Parking 3</div>
          <div className="parking-value">
            {slotStatus["slot2"] === "booked" ? (
              <div>
                {datawa.slot2 && datawa.slot2.userID === myUid ? (
                  <button onClick={() => handleReturn("slot2")}>
                    Return Slot
                  </button>
                ) : (
                  "Booked"
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!myUid) {
                    alert("Please login to prebook a slot!");
                    return;
                  }
                  setSelectedSlot("slot2");
                }}>
                Book Slot
              </button>
            )}
          </div>

          {datawa.slot2 && datawa.slot2.timestamp}
        </div>
      </div>
      <div ref={dialogRef} className="dialog">
        <div className="dialog-content">
          <span className="close" onClick={() => setSelectedSlot(null)}>
            &times;
          </span>
          <h2>Booking Details</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button onClick={() => handleBooking(name, vehicleNumber, mobile)}>
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
