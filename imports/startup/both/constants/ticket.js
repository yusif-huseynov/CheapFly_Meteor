export const getTicketDesign = (passanger, flight, ticket, orderPassenger) => {
  return `
  <body>

  <div style="position: absolute;>
  <ul "left" style="margin: 0; padding: 0; list-style: none; position: absolute; top: 0px; left: -5px;">
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
  </ul>
  
  <ul "right" style="margin: 0; padding: 0; list-style: none; position: absolute; top: 0px; right: -5px;">
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
    <li style="width: 0px; height: 0px;"></li>
  </ul>
  <div "ticket" style="position:relative;width: 610px; height: 250px; background: #FFB300; border-radius: 3px; box-shadow: 0 0 100px #aaa; border-top: 1px solid #E89F3D; border-bottom: 1px solid #E89F3D;">
    <span "airline" style="position: absolute; top: 10px; left: 10px; font-family: Arial; font-size: 20px; font-weight: bold; color: rgba(0,0,102,1);">Cheap Fly</span>
    <span "airline airlineslip" style="position: absolute; top: 10px; left: 455px; font-family: Arial; font-size: 20px; font-weight: bold; color: rgba(0,0,102,1);">Cheap Fly</span>
    <span "boarding" style="position: absolute; top: 10px; right: 220px; font-family: Arial; font-size: 18px; color: rgba(255,255,255,0.6);">Boarding pass</span>
    <div "content" style="position: absolute; top: 40px; width: 110%; height: 170px; background: #eee;">
      <span "jfk" style="position: absolute; top: 10px; left: 20px; font-family: Arial; font-size: 38px; color: #222;">${flight.from}</span>
     
      <span "sfo" style="position: absolute; top: 10px; left: 180px; font-family: Arial; font-size: 38px; color: black;">${flight.to}</span>
      
      <span "jfk jfkslip" style="position: absolute; font-size: 20px; top: 20px; left: 410px;">${flight.from}</span>
      <span "plane planeslip" style="position: absolute; top: 10px; left: 475px;">
      </span>
      <span "sfo sfoslip" style="position: absolute; font-size: 20px; top: 20px; left: 530px;">${flight.to}</span>
      <div "sub-content" style="background: #e5e5e5; width: 100%; height: 100px; position: absolute; top: 70px;">
        <span "name" style="position: absolute; top: 13px; left: 10px; font-family: Arial Narrow, Arial; font-weight: bold; font-size: 14px; color: #999;">PASSENGER<br><span style="color: #555; font-size: 17px;margin-bottom:10px">${passanger.firstName} ${passanger.lastName}</span></span>
        <span "flight" style="position: absolute; top: 10px; left: 180px; font-family: Arial Narrow, Arial; font-weight: bold; font-size: 14px; color: #999;">FLIGHT<br><span style="color: #555; font-size: 17px;">${flight.number}</span></span>
        <span "gate" style="position: absolute; top: 10px; left: 280px; font-family: Arial Narrow, Arial; font-weight: bold; font-size: 14px; color: #999;">GATE<br><span style="color: #555; font-size: 17px;">${flight.gate}</span></span>
        <span "seat" style="position: absolute; top: 10px; left: 350px; font-family: Arial Narrow, Arial; font-weight: bold; font-size: 14px; color: #999;">SEAT<br><span style="color: #555; font-size: 17px;">${orderPassenger.seat}</span></span>
        <span "boardingtime" style="position: absolute; top: 60px; left: 10px; font-family: Arial Narrow, Arial; font-weight: bold; font-size: 14px; color: #999;">DATE<br><span style="color: #555; font-size: 17px;">${moment(flight.date).format("DD MMM YYYY")} - ${flight.time}</span></span>
        <span "flight flightslip" style="position: absolute; left: 410px;">FLIGHT N&deg;<br><span style="color: #555; font-size: 17px;">${flight.number}</span></span>
        <span "seat seatslip" style="position: absolute; left: 540px;">SEAT<br><span style="color: #555; font-size: 17px;">${orderPassenger.seat}</span></span>
        <span "name nameslip" style="position: absolute; top: 50px; left: 410px;font-family: Arial Narrow, Arial; font-weight: bold; font-size: 14px; color: #999;">PASSENGER<br><span style="color: black; font-size: 17px;">${passanger.firstName}, ${passanger.lastName}</span></span>
      </div>
    </div>
</div>
</body>
  `;
};
