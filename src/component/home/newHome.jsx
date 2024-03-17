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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

const Slot = () => {
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
        "https://blynk.cloud/external/api/getAll?token=5R2lbSZMPr4qY2tMMGbvNCSDs_LQUU25"
      );
      console.log(response.data)
      setData(response.data);
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
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getSlotClassName = (slotData, slotStatus) => {
    if (slotData === 1 && slotStatus === "booked") {
      return "ParkBooked";
    } else if (slotData === 1 && slotStatus === "") {
      return "noBookPark";
    } else if (slotData === 0 && slotStatus === "booked") {
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
        timestamp: "",
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
    <div className="slots container">
      <h2>Parking Slots</h2>
      <div className="parking container">
        <div
          className={`parking-boc-section ${
            data ? getSlotClassName(data.v0, slotStatus["slot0"]) : "nullStatus"
          }`}
        >
          <div className="up-card">
            <div className="parking-name">
              <FontAwesomeIcon icon={faCar} />
            </div>
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
                  }}
                >
                  Book Slot
                </button>
              )}
            </div>
          </div>
          {/* {  console.log(datawa.slot0 )} */}
          {datawa.slot0 &&
            datawa.slot0.timestamp != "" &&
            datawa.slot0.userID === myUid && (
              <div className="btm-card">
                <p>
                  {new Date(datawa.slot0.timestamp).toLocaleString([], {
                    // month: "numeric",
                    // day: "2-digit",
                    // year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    // second: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            )}
        </div>

        <div
          className={`parking-boc-section ${
            data ? getSlotClassName(data.v1, slotStatus["slot1"]) : "nullStatus"
          }`}
        >
          <div className="up-card">
            <div className="parking-name">
              <FontAwesomeIcon icon={faCar} />
            </div>
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
                  }}
                >
                  Book Slot
                </button>
              )}
            </div>
          </div>
          {datawa.slot1 &&
            datawa.slot1.timestamp != "" &&
            datawa.slot1.userID === myUid && (
              <div className="btm-card">
                <p>
                  {new Date(datawa.slot1.timestamp).toLocaleString([], {
                    // month: "numeric",
                    // day: "2-digit",
                    // year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    // second: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            )}
        </div>

        <div
          className={`parking-boc-section ${
            data ? getSlotClassName(data.v2, slotStatus["slot2"]) : "nullStatus"
          } `}
        >
          <div className="up-card">
            <div className="parking-name">
              <FontAwesomeIcon icon={faCar} />
            </div>
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
                  }}
                >
                  Book Slot
                </button>
              )}
            </div>
          </div>
          {datawa.slot2 &&
            datawa.slot2.timestamp != "" &&
            datawa.slot2.userID === myUid && (
              <div className="btm-card">
                <p>
                  {new Date(datawa.slot2.timestamp).toLocaleString([], {
                    // month: "numeric",
                    // day: "2-digit",
                    // year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    // second: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            )}
        </div>
      </div>

      <div className="parking-indicator">
        <div className="car Available">
          <span>
            <FontAwesomeIcon icon={faCar} />
          </span>
          Available
        </div>
        <div className="car noBookPark">
          <span>
            <FontAwesomeIcon icon={faCar} />
          </span>
          Not Booked yet Parked
        </div>
        <div className="car ParkBooked">
          <span>
            <FontAwesomeIcon icon={faCar} />
          </span>
          Parked
        </div>
        <div className="car BookedOnly">
          <span>
            <FontAwesomeIcon icon={faCar} />
          </span>
          Booked
        </div>
      </div>
      <div
        ref={dialogRef}
        className="dialog"
        style={{ display: selectedSlot ? "block" : "none" }}
      >
        <div className="dialog-content">
          <span className="close" onClick={() => setSelectedSlot(null)}>
            &times;
          </span>
          <h2>Booking Details</h2>
          <div className="dialog-input">
            <input
              className="input-field"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <button
            className="book-button"
            onClick={() => handleBooking(name, vehicleNumber, mobile)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slot;
