const userdata = [
  {
    Organization: "Google",
    UserId: "akumar",
    UserName: "Ashok Kumar",
    Department: "Sales",
    Designation: "Sales",
    CheckInTime: 1548909000000,
    CheckOutTime: 1548945000000,
  },
  {
    Organization: "Google",
    UserId: "akumar",
    UserName: "Ashok Kumar",
    Department: "Sales",
    Designation: "Sales",
    CheckInTime: 1549081800000,
    CheckOutTime: 1549110600000,
  },
  {
    Organization: "FB",
    UserId: "phanis",
    UserName: "Phani Sai",
    Department: "Sales",
    Designation: "Sales",
    CheckInTime: 1548909000000,
    CheckOutTime: 1548945000000,
  },
  {
    Organization: "FB",
    UserId: "phanis",
    UserName: "Phani Sai",
    Department: "Sales",
    Designation: "Sales",
    CheckInTime: 1549081800000,
    CheckOutTime: 1549110600000,
  },
  {
    Organization: "FB",
    UserId: "lakshmig",
    UserName: "Laskhmi Gayathri",
    Department: "Quality",
    Designation: "QA Engineer",
    CheckInTime: 1549081800000,
    CheckOutTime: 1549110600000,
  },
  {
    Organization: "FB",
    UserId: "lakshmig",
    UserName: "Laskhmi Gayathri",
    Department: "Quality",
    Designation: "QA Engineer",
    CheckInTime: 1549081800000,
    CheckOutTime: 1549110600000,
  },
];

const configdata = [
  { HeaderName: "Organization", Column: "Organization", Merge: true },
  {
    HeaderName: "Department",
    Column: "Department",
    Merge: true,
  },
  {
    HeaderName: "UserName",
    Column: "UserName",
    Merge: true,
  },
  {
    HeaderName: "Date",
    Column: ({ CheckInTime }) => {
      return moment(CheckInTime).format("DD/MM/YYYY");
    },
    Merge: false,
  },
  {
    HeaderName: "Time",
    Column: ({ CheckInTime, CheckOutTime }) => {
      // Column can be a string or callback which can be called with the specific row record to get the computed column value.
      const secs = (CheckOutTime - CheckInTime) / 1000;
      // TODO: Return in (x Hrs y Mins) format.
      return secs / 60 + " Mins"; // Returning in minutes
    },
    Merge: false,
  },
];

let orgocc = new Map();
let reportOut = [];

reportOut = userdata.map((userdatum) => {
  let arr = Object.getOwnPropertyNames(userdatum);
  let { CheckInTime, CheckOutTime } = userdatum;
  return {
    [arr[0]]: userdatum.Organization,
    [arr[3]]: userdatum.Department,
    [arr[2]]: userdatum.UserName,
    Date: configdata[3].Column(CheckInTime),
    Time: configdata[4].Column({ CheckInTime, CheckOutTime }),
  };
});
reportOut.sort((a, b) => {
  if (a.Organization > b.Organization) {
    if (a.Department > b.Department) {
      if (a.UserName > b.UserName) {
        return 1;
      }
    }
  } else {
    return -1;
  }
});

// key  -> Organization/Department/UserName
reportOut.forEach((datum) => {
  const datumkeys = Object.keys(datum);

  datumkeys.forEach((key) => {
    if (key === "Organization") {
      if (!orgocc.get(datum.Organization)) {
        orgocc.set(datum.Organization, 1);
      } else {
        let val = orgocc.get(datum.Organization);
        orgocc.set(datum.Organization, val + 1);
      }
    }

    if (key === "Department") {
      const headerkey = [datum.Organization, datum.Department].join("/");
      if (!orgocc.get(headerkey)) {
        orgocc.set(headerkey, 1);
      } else {
        let val = orgocc.get(headerkey);
        orgocc.set(headerkey, val + 1);
      }
    }

    if (key === "UserName") {
      const headerkey = [
        datum.Organization,
        datum.Department,
        datum.UserName,
      ].join("/");
      if (!orgocc.get(headerkey)) {
        orgocc.set(headerkey, 1);
      } else {
        let val = orgocc.get(headerkey);
        orgocc.set(headerkey, val + 1);
      }
    }

    /*  if (key === "Date") {
      const headerkey = [
        datum.Organization,
        datum.Department,
        datum.UserName,
        datum.Date
      ].join("/");
      if (!orgocc.get(headerkey)) {
        orgocc.set(headerkey, 1);
      } else {
        let val = orgocc.get(headerkey);
        orgocc.set(headerkey, val + 1);
      }
    } */
    /* if (key === "Time") {
      const headerkey = [
        datum.Organization,
        datum.Department,
        datum.UserName,
        datum.Date,
        datum.Time
      ].join("/");
      if (!orgocc.get(headerkey)) {
        orgocc.set(headerkey, 1);
      } else {
        let val = orgocc.get(headerkey);
        orgocc.set(headerkey, val + 1);
      }
    }*/
  });
});

const render = (tableobject, tabledata, config, occurancemap) => {
  const datumkeys = Object.keys(tabledata[0]);

  var headerrow = '<table><tr style="border:1px solid red;padding:1em">';

  for(let i=0;i<datumkeys.length;i++){
    headerrow +=
    '<th style="border:1px solid red;padding:1em">' + datumkeys[i] + "</th>";
  }
  //tableobject.insertAdjacentHTML("beforeend", headerrow);

  tabledata.forEach((tabledatum, idx) => {
    const datumkeys = Object.keys(tabledatum);

    headerrow += '<tr style="border:1px solid red;padding:1em">';
    datumkeys.forEach((key, index) => {
      let value = 0;
      if (key === "Organization") {
        value = occurancemap.get(tabledatum.Organization);
      } else if (key === "Department") {
        const headerkey = [tabledatum.Organization, tabledatum.Department].join(
          "/"
        );
        value = orgocc.get(headerkey);
      } else if (key === "UserName") {
        const headerkey = [
          tabledatum.Organization,
          tabledatum.Department,
          tabledatum.UserName,
        ].join("/");
        value = orgocc.get(headerkey);
      } else if (key === "Date") {
        const headerkey = [
          tabledatum.Organization,
          tabledatum.Department,
          tabledatum.UserName,
          tabledatum.Date,
        ].join("/");
        value = orgocc.get(headerkey);
      } else if (key === "Time") {
        const headerkey = [
          tabledatum.Organization,
          tabledatum.Department,
          tabledatum.UserName,
          tabledatum.Date,
          tabledatum.Time,
        ].join("/");
        value = orgocc.get(headerkey);
      }

      if (value > 0) {
        headerrow +=
          '<td style="border:1px solid red;padding:1em;"' +
          "rowspan=" +
          "'" +
          value +
          "'" +
          ">" +
          "<p>" +
          tabledatum[key] +
          "</p>" +
          "</td>";

        console.log(tabledatum);
        if (tabledata[idx + 1][key] == tabledatum[key]) {
          let nextheaderkey = [
            tabledata[idx + 1].Organization,
            tabledata[idx + 1].Department,
            tabledata[idx + 1].UserName,
          ].join("/");
          if (key === "Organization") {
            orgocc.set(tabledata[idx + 1].Organization, 0);
          } else if (key === "Department") {
            const currheaderkey = [
              tabledatum.Organization,
              tabledatum.Department,
            ].join("/");

            const nextheaderkey = [
              tabledata[idx + 1].Organization,
              tabledata[idx + 1].Department,
            ].join("/");

            if (currheaderkey === nextheaderkey) {
              orgocc.set(nextheaderkey, 0);
            }
          } else if (key === "UserName") {
            const currheaderkey = [
              tabledatum.Organization,
              tabledatum.Department,
              tabledata[idx + 1].UserName,
            ].join("/");
            const nextheaderkey = [
              tabledata[idx + 1].Organization,
              tabledata[idx + 1].Department,
              tabledata[idx + 1].UserName,
            ].join("/");
            if (currheaderkey === nextheaderkey) {
              orgocc.set(nextheaderkey, 0);
            }
          }
        }
      } else {
        if (key === "Date" || key === "Time") {
          headerrow +=
            '<td style="border:1px solid red;padding:1em;"' +
            ">" +
            "<p>" +
            tabledatum[key] +
            "</p>" +
            "</td>";
        }
      }
    });
    headerrow += "</tr>";

    //tableobject.insertAdjacentHTML("beforeend", tablerow);
  });
  headerrow += "</table>";
  tableobject.insertAdjacentHTML("beforeend", headerrow);
};

render(document.getElementsByTagName("div")[0], reportOut, configdata, orgocc);
