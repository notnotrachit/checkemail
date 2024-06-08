"use client";
// import { getAccountFromEmail } from "@/lib/mongo";
// import { getEmails } from "@/lib/google";

// import { signOut } from "@/auth";


export default function EmailGet(props: { sign_out: any, email: any}) {


  async function email_button() {
    const fetch_email_button = document.getElementById("fetch_email");
    const fetch_email_txt = document.getElementById("fetch_email_txt");
    fetch_email_button!.setAttribute("disabled", "true");
    fetch_email_txt!.classList.add("loading");
    fetch_email_txt!.classList.add("loading-spinner");
    const count = (document.getElementById("email_count") as HTMLSelectElement).value;
    const res = await fetch("/api/getemail?count="+count, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    let j_email = JSON.stringify(data.emails);
    if (data.message == "Invalid token") {
      alert("Session timed out, please login again");
      localStorage.removeItem("emails");
      props.sign_out();
    }
    else{
      localStorage.setItem("emails", j_email);
      localStorage.setItem("email", props.email);
      window.location.reload();
      fetch_email_button!.removeAttribute("disabled");
      fetch_email_txt!.classList.remove("animate-spin");
    }

  }
  return (
    <>
      <div>
        <div className="flex my-4 items-center">
          <div>
            Number of emails:
          </div>
          <select className="border-2 border-gray-300 rounded-md px-2 py-1 mx-4" id="email_count">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
          </select>
          <button onClick={email_button} className="bg-info px-4 py-1 rounded-md" id="fetch_email">
            <span id="fetch_email_txt" className="">Fetch Emails</span>
          </button>
        </div>
      </div>
    </>
  );
}
