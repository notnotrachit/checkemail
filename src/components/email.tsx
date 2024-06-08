"use client";
import { useEffect, useState } from "react";

export default function EmailCard(props: { oemail: any }) {
    const [emails, setEmails] = useState<any>(null); 

    const [from_oemail, setFrom_oemail] = useState<any>(null);
    const [subject_oemail, setSubject_oemail] = useState<any>(null);
    const [catergory_oemail, setCatergory_oemail] = useState<any>(null);
    const [body_oemail, setBody_oemail] = useState<any>(null);

    useEffect(() => {
        if(localStorage.getItem("emails")!=null && localStorage.getItem("emails")!="undefined"){
            let lemail = localStorage.getItem("email");
            if (lemail!=props.oemail){
                localStorage.removeItem("emails");
            }
            let j_emails =  JSON.parse(localStorage.getItem("emails")!);
            setEmails(j_emails);
        }
    }, [props.oemail, setEmails])

    async function classify(){    
        let emails = JSON.parse(localStorage.getItem("emails")!);
        const oaiKey = localStorage.getItem("oaiKey");
        const classify_btn = document.getElementById("classify_btn");
        const classify_btn_text = document.getElementById("classify_btn_text");
        classify_btn!.setAttribute("disabled", "true");
        classify_btn_text!.classList.add("loading");
        classify_btn_text!.classList.add("loading-spinner");

        let response = await fetch("/api/classify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
              {
                emails: emails,
                oaiKey: oaiKey
              }
            )
        });
        let new_emails = await response.json();
        localStorage.setItem("emails", JSON.stringify(new_emails));
        classify_btn!.removeAttribute("disabled");
        classify_btn_text!.classList.remove("loading");
        classify_btn_text!.classList.remove("loading-spinner");
        setEmails(new_emails);
    }

    var decodeBase64 = function (s: any) {
      var e: { [key: string]: number } = {},
        i,
        b = 0,
        c,
        x,
        l = 0,
        a,
        r = "",
        w = String.fromCharCode,
        L = s.length;
      var A =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0; i < 64; i++) {
        e[A.charAt(i)] = i;
      }
      for (x = 0; x < L; x++) {
        c = e[s.charAt(x)];
        b = (b << 6) + c;
        l += 6;
        while (l >= 8) {
          ((a = (b >>> (l -= 8)) & 0xff) || x < L - 2) && (r += w(a));
        }
      }
      return r;
    };

    function open_email(email: any){
        for (let i = 0; i < email.payload.headers.length; i++) {
            if (email.payload.headers[i].name === "From") {
                setFrom_oemail(email.payload.headers[i].value);
            }
            if (email.payload.headers[i].name === "Subject") {
                setSubject_oemail(email.payload.headers[i].value);
            }
            if (email.payload.body.data){
                let data = decodeBase64(
                  email.payload.body.data.replace(/-/g, "+").replace(/_/g, "/")
                );
                setBody_oemail(data);
            }
            else if (email.payload.parts){
                let collective_data = "";
                for (let j = 0; j < email.payload.parts.length; j++) {
                    if (email.payload.parts[j].mimeType === "text/html") {
                        collective_data += decodeBase64(
                          email.payload.parts[j].body.data.replace(/-/g, '+').replace(/_/g, '/')
                        );
                    }
                }
                setBody_oemail(collective_data);
            }
            if(email.classification){
                setCatergory_oemail(email.classification);
            }
        }
        const email_backdrop = document.getElementById("email_backdrop");
        email_backdrop!.classList.remove("hidden");
        const email_sidebar = document.getElementById("email_sidebar");
        email_sidebar!.classList.remove("translate-x-full");
    }

    function close_email(){
        const email_backdrop = document.getElementById("email_backdrop");
        email_backdrop!.classList.add("hidden");
        const email_sidebar = document.getElementById("email_sidebar");
        email_sidebar!.classList.add("translate-x-full");
    }

    return (
      <>
        {emails && (
          <div className="flex justify-between my-4">
            <span>Emails</span>

            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-md"
              onClick={classify}
              id="classify_btn"
            >
              <span id="classify_btn_text">Classify</span>
            </button>
          </div>
        )}
        {emails &&
          emails.map((email: any) => (
            <div
              className="w-full border-white border-2 rounded-md px-5 my-2 flex justify-between spacing-x-4"
              key={email.id}
              onClick={() => open_email(email)}
            >
              <div>
                {email.payload.headers.map((header: any) => {
                  if (header.name === "From") {
                    return (
                      <span className="text-sm" key={header.name}>
                        {header.value}
                      </span>
                    );
                  }
                })}
                <br />
                {email.payload.headers.map((header: any) => {
                  if (header.name === "Subject") {
                    return (
                      <span className="text-3xl font-bold" key={header.name}>
                        {header.value}
                      </span>
                    );
                  }
                })}
                <br />
                <span className="text-xl">{email.snippet}</span>
              </div>
              {email.classification && (
                <div className="flex justify-center items-center">
                  {email.classification === "Important" && (
                    <div className={"px-4 py-1 rounded-md bg-success"}>
                      {email.classification}
                    </div>
                  )}
                  {email.classification === "Promotional" && (
                    <div className={"px-4 py-1 rounded-md bg-warning"}>
                      {email.classification}
                    </div>
                  )}
                  {email.classification === "Spam" && (
                    <div className={"px-4 py-1 rounded-md bg-error"}>
                      {email.classification}
                    </div>
                  )}
                  {email.classification === "Social" && (
                    <div className={"px-4 py-1 rounded-md bg-info"}>
                      {email.classification}
                    </div>
                  )}
                  {email.classification === "Marketting" && (
                    <div className={"px-4 py-1 rounded-md bg-purple-500"}>
                      {email.classification}
                    </div>
                  )}
                  {email.classification === "General" && (
                    <div className={"px-4 py-1 rounded-md bg-gray-500"}>
                      {email.classification}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        <div
          className="hidden fixed top-0 left-0 w-screen h-screen bg-black/20 backdrop-blur-sm"
          id="email_backdrop"
          onClick={close_email}
        ></div>
        <div
          className="top-0 right-0 h-screen w-[36rem] bg-gray-800 fixed z-10 translate-x-full transition-all ease-in-out"
          id="email_sidebar"
        >
          <div className="py-16 px-6">
            <div className="flex justify-between items-center">
              <div>{from_oemail}</div>
              {catergory_oemail === "Important" && (
                <div className={"px-4 py-1 rounded-md bg-success"}>
                  {catergory_oemail}
                </div>
              )}
              {catergory_oemail === "Promotional" && (
                <div className={"px-4 py-1 rounded-md bg-warning"}>
                  {catergory_oemail}
                </div>
              )}
              {catergory_oemail === "Spam" && (
                <div className={"px-4 py-1 rounded-md bg-error"}>
                  {catergory_oemail}
                </div>
              )}
              {catergory_oemail === "Social" && (
                <div className={"px-4 py-1 rounded-md bg-info"}>
                  {catergory_oemail}
                </div>
              )}
              {catergory_oemail === "Marketting" && (
                <div className={"px-4 py-1 rounded-md bg-purple-500"}>
                  {catergory_oemail}
                </div>
              )}
              {catergory_oemail === "General" && (
                <div className={"px-4 py-1 rounded-md bg-gray-500"}>
                  {catergory_oemail}
                </div>
              )}
            </div>
            <div className="mt-16 overflow-y-auto ">
              <iframe
                srcDoc={body_oemail}
                className="w-full h-[80vh] border-none rounded-md"
              />
            </div>
          </div>
        </div>
      </>
    );
}
