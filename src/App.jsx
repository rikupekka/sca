import { useState, useEffect, useCallback, useRef } from "react";
import scaLogo from "./scaLogo.js";

// ── COLOURS ───────────────────────────────────────────────────────────────────
const C = {
  navy:"#1b4f8a", navyD:"#0f3460", navyL:"#2472cc", accent:"#8b1a1a",
  bg:"#f0f4f8", white:"#ffffff", border:"#dde6f0", borderD:"#b8cfe8",
  text:"#1a2332", sub:"#5a7a9a", muted:"#9aaab8", faint:"#eef2f7",
  green:"#2e7d32", red:"#c62828", amber:"#b45309"
};

// ── AIRLINE DATA ──────────────────────────────────────────────────────────────
const AIRLINES = [
  {name:"Qantas",code:"QF",logo:"🦘",formName:"MEDA Form",leadTime:"48–72 hrs",requirements:["MEDA form signed by treating physician","Fit to Fly certificate","In-flight equipment details","Escort qualifications"],formUrl:"https://www.qantas.com/content/dam/qantas/pdfs/travel-info/qantas-medical-information-form.pdf",pageUrl:"https://www.qantas.com/au/en/travel-info/specific-needs/medical-conditions.html",notes:"Stretcher needs 96hr notice. Contact Qantas Medical via reservations.",stretch:true,equip:true},
  {name:"Emirates",code:"EK",logo:"✈",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["MEDIF Part 1 — passenger","MEDIF Part 2 — physician","Fit to Fly declaration","Equipment approval"],formUrl:"https://c.ekstatic.net/ecl/documents/before-you-fly/emirates-medif-form.pdf",pageUrl:"https://www.emirates.com/english/before-you-fly/medical-requirements/",notes:"All O2 must be Emirates-supplied. Dedicated medical desk.",stretch:true,equip:true},
  {name:"Singapore Airlines",code:"SQ",logo:"🦁",formName:"MEDA Clearance",leadTime:"48 hrs",requirements:["SQ Medical Clearance Form","Physician declaration","O2 pre-approval if needed","Escort registration"],formUrl:"https://www.singaporeair.com/content/dam/SACL/en_UK/flying-with-us/special-assistance/MEDIF.pdf",pageUrl:"https://www.singaporeair.com/en_UK/us/flying-withus/special-assistance/medical-assistance/",notes:"Very accommodating for repatriation. Good MEDA process.",stretch:true,equip:true},
  {name:"Cathay Pacific",code:"CX",logo:"🐉",formName:"MEDA Form Pt 1",leadTime:"48 hrs",requirements:["MEDA Form Part 1","Medical certificate","Current clinical registration for escort","Equipment manifest"],formUrl:"https://www.cathaypacific.com/content/dam/cx/travel-information/special-assistance/medical-assistance/cx-meda-form-part-1_051120.pdf",pageUrl:"https://www.cathaypacific.com/cx/en_AU/travelling-information/special-assistance/medical-assistance.html",notes:"All equipment declared in advance. Good HKG connections.",stretch:true,equip:true},
  {name:"Etihad",code:"EY",logo:"🌙",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["MEDIF completed by physician","Fit to fly certificate","Equipment approval","Escort credential verification"],formUrl:"https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/Global/pdf/MEDIF-form.pdf",pageUrl:"https://www.etihad.com/en/fly-etihad/onboard/special-assistance",notes:"Etihad Medical Services reviews all submissions. Allow extra time.",stretch:true,equip:true},
  {name:"Thai Airways",code:"TG",logo:"🌺",formName:"MEDA Form",leadTime:"72 hrs",requirements:["MEDA form signed by physician","Fit to Fly declaration","Equipment pre-approval","Escort qualification letter"],formUrl:"https://www.thaiairways.com/en/travel_information/special_needs/medical.page",pageUrl:"https://www.thaiairways.com/en/travel_information/special_needs/medical.page",notes:"72hr notice required. Good BKK gateway for SE Asia.",stretch:true,equip:false},
  {name:"Malaysia Airlines",code:"MH",logo:"🌙",formName:"MEDA Form",leadTime:"48 hrs",requirements:["MEDA form","Medical certificate","Escort credentials","Equipment list"],formUrl:"https://www.malaysiaairlines.com/my/en/site-help/special-assistance.html",pageUrl:"https://www.malaysiaairlines.com/my/en/site-help/special-assistance.html",notes:"Contact MH medical desk for stretcher cases. KUL hub.",stretch:true,equip:true},
  {name:"Air New Zealand",code:"NZ",logo:"🥝",formName:"MEDA Clearance",leadTime:"48 hrs",requirements:["Medical clearance form","Physician sign-off","Escort registration","Equipment manifest"],formUrl:"https://www.airnewzealand.com.au/special-assistance",pageUrl:"https://www.airnewzealand.com.au/special-assistance",notes:"Good for trans-Tasman. Does not accept stretcher cases.",stretch:false,equip:true},
  {name:"British Airways",code:"BA",logo:"🎯",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["MEDIF by physician","BA Medical clearance","Fit to fly certificate","Escort documentation"],formUrl:"https://www.britishairways.com/cms/global/pdfs/health/BA_Medical_Information_Form.pdf",pageUrl:"https://www.britishairways.com/en-gb/information/travel-assistance/medical-assistance",notes:"Thorough BA Medical Clearance unit. Good for Europe via LHR.",stretch:true,equip:true},
  {name:"Lufthansa",code:"LH",logo:"🦅",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["MEDIF Part A — passenger","MEDIF Part B — physician","Equipment pre-approval","Escort credentials"],formUrl:"https://www.lufthansa.com/content/dam/lh/documents/fly/special-assistance/medif-form.pdf",pageUrl:"https://www.lufthansa.com/au/en/passenger-with-reduced-mobility",notes:"Efficient clearance. FRA hub connections.",stretch:true,equip:true},
  {name:"Qatar Airways",code:"QR",logo:"🌟",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["MEDIF signed by physician","Fit to fly declaration","Equipment manifest","Escort qualifications"],formUrl:"https://www.qatarairways.com/content/dam/documents/MEDIF.pdf",pageUrl:"https://www.qatarairways.com/en-au/homepage/special-assistance/",notes:"Excellent business class for medical. Good DOH hub.",stretch:true,equip:true},
  {name:"Korean Air",code:"KE",logo:"🎋",formName:"MEDA Form",leadTime:"48 hrs",requirements:["MEDA clearance form","Medical certificate","Escort documentation","Equipment list"],formUrl:"https://www.koreanair.com/content/koreanair/en/travel-information/special-care.html",pageUrl:"https://www.koreanair.com/content/koreanair/en/travel-information/special-care.html",notes:"Good East Asia routing. ICN strong transit hub.",stretch:true,equip:true},
  {name:"Japan Airlines",code:"JL",logo:"🗻",formName:"MEDA Form",leadTime:"48 hrs",requirements:["JAL MEDA form","Physician declaration","Escort credentials","Equipment pre-approval"],formUrl:"https://www.jal.co.jp/en/inter/service/medical/",pageUrl:"https://www.jal.co.jp/en/inter/service/medical/",notes:"Submit early — very process-oriented. NRT/HND routing.",stretch:true,equip:true},
  {name:"KLM",code:"KL",logo:"🌷",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["MEDIF form","Physician certificate","Escort documentation","Equipment list"],formUrl:"https://www.klm.com/content/dam/klm/en/images/guides/special-assistance/MEDIF-form-en.pdf",pageUrl:"https://www.klm.com/au/en/information/special-assistance/medical",notes:"AMS hub for Europe–Australia. Efficient clearance.",stretch:true,equip:true},
  {name:"Turkish Airlines",code:"TK",logo:"🌙",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["MEDIF signed by physician","Fit to fly certificate","Equipment declaration","Escort qualification letter"],formUrl:"https://www.turkishairlines.com/en-int/any-questions/travel-information/disabled-passengers/",pageUrl:"https://www.turkishairlines.com/en-int/any-questions/travel-information/disabled-passengers/",notes:"Competitive Europe pricing via IST. Allow extra processing time.",stretch:true,equip:true},
  {name:"Air France",code:"AF",logo:"🗼",formName:"MEDIF Form B",leadTime:"48 hrs",requirements:["MEDIF Form B by physician","Passenger section completed","Equipment manifest","Escort documentation"],formUrl:"https://img.static-af.com/m/7851647b0db6ca4f/original/PMR-Form-B-EN.pdf",pageUrl:"https://www.airfrance.com.au/AU/en/common/guidevoyageur/pratique/assistance-passager-besoin-special-airfrance.htm",notes:"CDG hub for Europe–Australia. 48hr prior via reservations.",stretch:true,equip:true},
  {name:"ANA",code:"NH",logo:"✈",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["ANA MEDIF form","Physician sign-off","Escort credentials","Equipment list"],formUrl:"https://www.ana.co.jp/share/assist_eng/pdf/medif.pdf",pageUrl:"https://www.ana.co.jp/en/au/travel-information/special-assistance/medical/",notes:"Submit early. Good Japan routing via NRT/HND.",stretch:true,equip:true},
  {name:"China Airlines",code:"CI",logo:"🐼",formName:"Medical Clearance Form",leadTime:"48 hrs",requirements:["Medical Clearance Form by physician","Escort documentation","Equipment pre-approval"],formUrl:"https://www.china-airlines.com/it/en/Images/Medical-Clearance-Form-AC-en_tcm201-3587.pdf",pageUrl:"https://www.china-airlines.com/au/en/fly-with-ci/special-services/special-assistance",notes:"TPE hub for East Asia routing.",stretch:true,equip:true},
  {name:"Finnair",code:"AY",logo:"❄️",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["Finnair MEDIF form","Physician declaration","Escort credentials","Equipment manifest"],formUrl:"https://cms.finnair.com/resource/blob/2191752/8295a0a29aed29c84f3b3412b0bd7e47/medif-form-en.pdf",pageUrl:"https://www.finnair.com/au/gb/information/accessibility",notes:"HEL hub for Nordic/Europe routing.",stretch:true,equip:true},
  {name:"Garuda Indonesia",code:"GA",logo:"🦅",formName:"MEDIF Form",leadTime:"48 hrs",requirements:["Garuda MEDIF form","Physician sign-off","Escort documentation","Equipment list"],formUrl:"https://www.garuda-indonesia.com/content/dam/garuda/files/pdf/form-medif.pdf",pageUrl:"https://www.garuda-indonesia.com/en/id/garuda-experience/on-ground/special-assistance",notes:"Indonesia routing via CGK hub.",stretch:true,equip:true},
];

// ── STORAGE ───────────────────────────────────────────────────────────────────
const SK = "sca_v4";
const load = () => { try { return JSON.parse(localStorage.getItem(SK)||"[]"); } catch { return []; } };
const persist = (c) => { try { localStorage.setItem(SK, JSON.stringify(c)); } catch(e){} };

const fresh = () => ({
  id: Date.now().toString(),
  created: new Date().toISOString(), updated: new Date().toISOString(),
  // Patient
  patientName:"", dob:"", age:"", caseNo:"", diagnosis:"", mobility:"ambulant",
  background:"", patientContact:"", companion:"",
  // Referral
  insurer:"", insurerContact:"", quoteDate: new Date().toISOString().slice(0,10),
  // Route
  fromCity:"", fromCountry:"", toCity:"", toState:"",
  pickupFacility:"", pickupWard:"", pickupAddress:"",
  dropPhysician:"", dropFacility:"", dropWard:"", dropAddress:"", dropPhone:"", dropAdmission:"",
  // Timeline
  preFlightDate:"", preFlightTime:"", escortDate:"", escortTime:"", departDate:"", departTime:"",
  airportTransfer:"",
  // Flights
  airline:"", flightClass:"Economy", escortPrice:"", patientPrice:"", escorts:"1", escortType:"Registered Nurse",
  dateFrom:"", dateTo:"",
  // Hotel
  hotelYes:"yes", hotelSide:"origin", nights:"1", nightRate:"",
  pickupHospital:"", dropHospital:"", radiusKm:"3",
  // Costs
  transfersYes:"yes", numTransfers:"2", transferCost:"", adminFee:"",
  equipment:"", scaContacts:"0459 944 569 - Melinda\n0402 856 540 - Brooke\nOffice: [07] 3447 0280",
  notes:"",
});

// ── CLAUDE API ────────────────────────────────────────────────────────────────
async function claude(prompt, webSearch = false) {
  // Calls /api/claude (Vercel serverless proxy) which adds the API key server-side
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  };
  if (webSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err.slice(0,200)}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("\n");
  return text;
}

// ── UNCONTROLLED INPUT — fixes 1-letter-at-a-time bug ────────────────────────
function F({ label, val, onSave, type = "text", ph = "", rows = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.value = val || "";
    }
  }, [val]);
  const props = {
    ref,
    defaultValue: val || "",
    onBlur: () => ref.current && onSave(ref.current.value),
    onKeyDown: (e) => { if (e.key === "Enter" && !rows) ref.current?.blur(); },
    placeholder: ph || label || "",
    style: INP,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LBL}>{label}</label>}
      {rows ? <textarea {...props} rows={rows} style={{ ...INP, resize: "vertical" }} /> : <input type={type} {...props} />}
    </div>
  );
}

function Sel({ label, val, onChange, opts }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LBL}>{label}</label>}
      <select value={val || ""} onChange={e => onChange(e.target.value)} style={INP}>
        {opts.map(o => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
      </select>
    </div>
  );
}

// ── STYLE CONSTANTS ───────────────────────────────────────────────────────────
const INP = {
  fontFamily: "inherit", fontSize: 13, color: C.text,
  background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 8,
  padding: "9px 12px", width: "100%", outline: "none",
};
const LBL = {
  fontSize: 10, fontWeight: 700, color: C.sub,
  textTransform: "uppercase", letterSpacing: "0.08em",
};
const CARD = {
  background: C.white, borderRadius: 14,
  border: `1px solid ${C.border}`,
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)", padding: 24, marginBottom: 18,
};
const SH = ({ t }) => (
  <div style={{
    fontSize: 13, fontWeight: 700, color: C.navy,
    paddingBottom: 10, marginBottom: 16,
    borderBottom: `2px solid #e8f0fa`,
  }}>{t}</div>
);
const G2 = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>
);
const FULL = ({ children }) => <div style={{ gridColumn: "1/-1" }}>{children}</div>;

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#b0c4de" : `linear-gradient(135deg, ${C.navy}, ${C.navyL})`,
      color: "#fff", border: "none", borderRadius: 9, padding: "10px 22px",
      fontWeight: 700, fontSize: 13, cursor: disabled ? "wait" : "pointer",
      fontFamily: "inherit", transition: "all 0.15s",
    }}>{children}</button>
  );
}

function GhostBtn({ onClick, children, small }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent", border: `1.5px solid ${C.border}`,
      borderRadius: 8, padding: small ? "7px 14px" : "9px 18px",
      color: C.sub, fontWeight: 600, fontSize: small ? 11 : 12,
      cursor: "pointer", fontFamily: "inherit",
    }}>{children}</button>
  );
}

function Spin({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: 32, color: C.sub }}>
      <div style={{ fontSize: 24, animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</div>
      <div style={{ fontSize: 12, marginTop: 8 }}>{msg}</div>
    </div>
  );
}

function OutBox({ text, onCopy, onRegen }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <PrimaryBtn onClick={onCopy}>Copy</PrimaryBtn>
        {onRegen && <GhostBtn onClick={onRegen} small>Regenerate</GhostBtn>}
      </div>
      <div style={{
        background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 10,
        padding: 18, whiteSpace: "pre-wrap", fontSize: 12.5, lineHeight: 1.8,
        color: C.text, maxHeight: 500, overflowY: "auto", fontFamily: "inherit",
      }}>{text}</div>
    </div>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "#fff1f1", border: `1px solid #fcc`, borderRadius: 8,
      padding: "10px 14px", fontSize: 12, color: C.red, marginTop: 12,
    }}>⚠ {msg}</div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [tool, setTool]     = useState("brief");
  const [cases, setCases]   = useState(load);
  const [ac, setAc]         = useState(null);
  const [medaAirline, setMedaAirline] = useState(null);
  const [medaQ, setMedaQ]   = useState("");

  // Generated outputs
  const [brief, setBrief]     = useState(""); const [briefErr, setBriefErr]   = useState(""); const [briefBusy, setBriefBusy] = useState(false);
  const [quote, setQuote]     = useState(""); const [quoteErr, setQuoteErr]   = useState(""); const [quoteBusy, setQuoteBusy] = useState(false);
  const [hotels, setHotels]   = useState([]); const [hotelErr, setHotelErr]   = useState(""); const [hotelBusy, setHotelBusy] = useState(false);
  const [hotelSide, setHotelSide] = useState("origin");
  const [selHotel, setSelHotel] = useState(null);
  const [meda, setMeda]       = useState(""); const [medaErr, setMedaErr]     = useState(""); const [medaBusy, setMedaBusy]   = useState(false);

  useEffect(() => { persist(cases); }, [cases]);

  const upsert = useCallback((u) => {
    u.updated = new Date().toISOString();
    setCases(prev => {
      const i = prev.findIndex(c => c.id === u.id);
      if (i >= 0) { const n = [...prev]; n[i] = u; return n; }
      return [u, ...prev];
    });
    setAc(u);
  }, []);

  const sv  = f => v => { if (!ac) return; const u = { ...ac, [f]: v }; upsert(u); };

  const newCase = () => {
    const c = fresh(); upsert(c); setAc(c);
    setTool("brief"); setScreen("case");
    setBrief(""); setBriefErr(""); setQuote(""); setQuoteErr("");
    setHotels([]); setHotelErr(""); setSelHotel(null);
    setMeda(""); setMedaErr(""); setMedaAirline(null);
  };
  const openCase = c => {
    setAc(c); setTool("brief"); setScreen("case");
    setBrief(""); setBriefErr(""); setQuote(""); setQuoteErr("");
    setHotels([]); setHotelErr(""); setSelHotel(null);
    setMeda(""); setMedaErr(""); setMedaAirline(null);
  };
  const delCase = id => {
    if (!window.confirm("Delete this case?")) return;
    setCases(p => p.filter(c => c.id !== id));
    if (ac?.id === id) { setAc(null); setScreen("home"); }
  };

  // Costs
  const ft = ac ? (parseFloat(ac.escortPrice)||0)*parseInt(ac.escorts||1) + (parseFloat(ac.patientPrice)||0) : 0;
  const ht = ac && ac.hotelYes === "yes" ? (parseFloat(ac.nightRate)||0) * (parseInt(ac.nights)||1) : 0;
  const tt = ac && ac.transfersYes === "yes" ? (parseFloat(ac.transferCost)||0) * (parseInt(ac.numTransfers)||1) : 0;
  const mt = ac ? parseFloat(ac.adminFee)||0 : 0;
  const grand = ft + ht + tt + mt;
  const fmt = n => n.toLocaleString("en-AU", { minimumFractionDigits: 2 });

  // ── GENERATE BRIEF ──────────────────────────────────────────────────────────
  const genBrief = async () => {
    setBriefBusy(true); setBrief(""); setBriefErr("");
    try {
      const text = await claude(
        `You are a coordinator at Southern Cross Assist (SCA). Generate a professional SCA repatriation mission brief.\n\nCase data:\n${JSON.stringify(ac, null, 2)}\n\nGenerate a complete brief with these sections:\n1) "Dear Team Member, Thank you for accepting this mission to repatriate our client..."\n2) Patient Details: Name, DOB, Age, Case Number, Type of Repatriation, Diagnosis, Relevant Background, Patient Contact, Family/Companion\n3) Location of Patient: pickup facility, ward, address\n4) Drop Off of Patient: physician, facility, ward, address, phone, admission details\n5) Key Timeline: pre-flight assessment datetime, escort arrive datetime, depart datetime\n6) Ground Transfers: formatted table Type | Date | Pickup Time | From | Drop-off Time | To | Provider | Comments\n7) Medical: Special Equipment required\n8) Contact Details whilst away: SCA contacts\n9) Update Checkpoints: please update via text when — take off / land or arrive at hotel or hospital / pre-flight assessment done / en route to airport with patient / boarded flight / arrived at destination / patient handed over to hospital\n\nBe professional and concise.`
      );
      setBrief(text || "No content returned — please try again.");
    } catch (e) {
      setBriefErr(e.message);
    }
    setBriefBusy(false);
  };

  // ── GENERATE QUOTE ──────────────────────────────────────────────────────────
  const genQuote = async () => {
    setQuoteBusy(true); setQuote(""); setQuoteErr("");
    try {
      const total = ft + ht + tt + mt;
      const hotelNote = selHotel
        ? `Selected hotel: ${selHotel.name} (${selHotel.distanceKm}km from hospital, ${selHotel.stars}★, AUD $${selHotel.rateAUD}/night)`
        : "";
      const text = await claude(
        `You are an expert medical repatriation coordinator at Southern Cross Assist (SCA). Generate a professional repatriation cost quotation for a referring insurer.\n\nCase:\n${JSON.stringify(ac, null, 2)}\n${hotelNote}\n\nCalculated costs:\n- Flights: AUD $${ft.toFixed(2)} (${ac.escorts} escort × $${ac.escortPrice} + patient $${ac.patientPrice})\n- Hotel: AUD $${ht.toFixed(2)} (${ac.nights} nights × $${ac.nightRate}/night)\n- Transfers: AUD $${tt.toFixed(2)} (${ac.numTransfers} × $${ac.transferCost})\n- Medical/Admin: AUD $${mt.toFixed(2)}\n- GRAND TOTAL: AUD $${total.toFixed(2)}\n\nInclude:\n1) MEDICAL REPATRIATION QUOTATION header — date, case number, referring company\n2) Patient Summary\n3) Repatriation Plan with airline MEDA notes and route considerations\n4) Itemised Cost Table\n5) Inclusions & Exclusions\n6) MEDA Requirements\n7) Validity: 5 business days\n8) Authorisation section\n9) Southern Cross Assist contact footer\n\nProfessional insurer-facing tone.`
      );
      setQuote(text || "No content returned — please try again.");
    } catch (e) {
      setQuoteErr(e.message);
    }
    setQuoteBusy(false);
  };

  // ── FIND HOTELS ─────────────────────────────────────────────────────────────
  const findHotels = async () => {
    const hospital = (hotelSide === "origin" ? ac.pickupHospital : ac.dropHospital || "").trim();
    const city = hotelSide === "origin"
      ? `${ac.fromCity || ""} ${ac.fromCountry || ""}`.trim()
      : `${ac.toCity || ""} ${ac.toState || ""} Australia`.trim();

    if (!hospital) {
      setHotelErr("Please enter a hospital name in the field below first.");
      return;
    }

    setHotelBusy(true); setHotelErr(""); setHotels([]); setSelHotel(null);

    try {
      const radius = ac.radiusKm || 3;
      const text = await claude(
        `Search the web for hotels near this hospital: "${hospital}", ${city}.\n\nFind up to 5 real, currently operating hotels within ${radius}km walking or driving distance.\n\nRespond with ONLY a JSON array — no explanation, no markdown, no code fences. The array must start with [ and end with ].\n\nRequired format:\n[\n  {\n    "name": "Hotel Name",\n    "distanceKm": 0.8,\n    "stars": 4,\n    "rateAUD": 180,\n    "suitability": "One sentence on why suitable for medical escort",\n    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Hotel+Name+City"\n  }\n]\n\nSort by distance ascending. Only include hotels genuinely close to the hospital.`,
        true // enable web search
      );

      // Robust JSON extraction
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      if (start === -1 || end === -1 || end <= start) {
        throw new Error("No hotel list found in response. Try a more specific hospital name.");
      }
      const parsed = JSON.parse(text.slice(start, end + 1));
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("No hotels found near that location. Try including city and country.");
      }
      setHotels(parsed);
    } catch (e) {
      setHotelErr(`Search failed: ${e.message}`);
    }
    setHotelBusy(false);
  };

  // ── MEDA AUTO-FILL ──────────────────────────────────────────────────────────
  const genMeda = async (airline) => {
    if (!ac?.patientName) {
      setMedaErr("Please enter patient details in Mission Brief first.");
      return;
    }
    setMedaBusy(true); setMeda(""); setMedaErr("");
    try {
      const text = await claude(
        `You are a medical repatriation coordinator completing a ${airline.formName} for ${airline.name} (${airline.code}).\n\nPre-fill the form using patient data below.\n\nPatient data:\n${JSON.stringify(ac, null, 2)}\n\nGenerate a pre-filled form with all relevant sections:\n- Passenger details\n- Flight information\n- Diagnosis and medical history\n- Fitness to fly assessment\n- In-flight medical requirements\n- Special equipment needed\n- Escort details and qualifications\n\nClearly mark any field requiring physician sign-off with: [PHYSICIAN TO COMPLETE]\nFormat with clear section headers. Be thorough and professional.`
      );
      setMeda(text || "No content returned — please try again.");
    } catch (e) {
      setMedaErr(e.message);
    }
    setMedaBusy(false);
  };

  const cp = text => {
    navigator.clipboard.writeText(text).catch(() => {
      const t = document.createElement("textarea");
      t.value = text; document.body.appendChild(t); t.select();
      document.execCommand("copy"); document.body.removeChild(t);
    });
  };

  const filteredAirlines = AIRLINES.filter(a =>
    a.name.toLowerCase().includes(medaQ.toLowerCase()) ||
    a.code.toLowerCase().includes(medaQ.toLowerCase())
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Figtree','DM Sans',system-ui,sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        select { appearance: none; -webkit-appearance: none; cursor: pointer; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #c8d4e0; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes up { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation: up 0.2s ease both; }
        .hov:hover { border-color: #1b4f8a !important; box-shadow: 0 3px 14px rgba(27,79,138,0.12) !important; transform: translateY(-1px); }
        .tool-btn { width:100%; display:flex; align-items:center; gap:10px; padding:11px 16px; background:transparent; border:none; border-left:3px solid transparent; color:#7a90a8; font-size:12px; font-weight:500; text-align:left; cursor:pointer; transition:all 0.15s; font-family:inherit; }
        .tool-btn.on { background:#eef4fd; border-left-color:#1b4f8a; color:#1b4f8a; font-weight:700; }
        .tool-btn:hover { background:#f5f8fc; color:#1b4f8a; }
        input:focus, select:focus, textarea:focus { border-color: #1b4f8a !important; box-shadow: 0 0 0 3px rgba(27,79,138,0.1) !important; outline: none; }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 58, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={scaLogo} alt="SCA" style={{height:46,width:46,objectFit:"contain",flexShrink:0}}/>
          <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, letterSpacing: "-0.3px" }}>Southern Cross Assist</div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>Repatriation Coordination Platform</div>
          </div>
          {ac && screen === "case" && (
            <span style={{ marginLeft: 4, fontSize: 11, color: C.muted, paddingLeft: 12, borderLeft: `1px solid ${C.border}` }}>
              {ac.caseNo || ac.patientName || "New Case"}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["home", "cases"].map(s => (
            <button key={s} onClick={() => setScreen(s)} style={{
              background: screen === s ? "#e8f0fa" : "transparent",
              border: "none", borderRadius: 7, padding: "7px 14px",
              color: screen === s ? C.navy : C.sub, fontFamily: "inherit",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize",
            }}>
              {s === "cases" ? `Cases (${cases.length})` : s}
            </button>
          ))}
          <PrimaryBtn onClick={newCase}>+ New Case</PrimaryBtn>
        </div>
      </nav>

      {/* HOME */}
      {screen === "home" && (
        <div style={{ padding: "36px 24px", maxWidth: 860, margin: "0 auto" }} className="fade">
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Coordination Dashboard</div>
            <div style={{ fontSize: 13, color: C.sub }}>Case management, quotes, hotel finder and MEDA forms — all in one place.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
            {[
              { icon: "📋", title: "Mission Brief",  desc: "Generate complete SCA-style repatriation brief for escort nurse.",  t: "brief",  col: C.navy,   bg: "#eef4fd" },
              { icon: "💰", title: "Quote Generator", desc: "Itemised cost quotation ready for the referring insurer.",          t: "quote",  col: C.amber,  bg: "#fef9ee" },
              { icon: "🏨", title: "Hotel Finder",    desc: "Find accommodation within 1–5km of pickup or receiving hospital.", t: "hotels", col: "#6d28d9", bg: "#f3f0ff" },
              { icon: "📄", title: "MEDA / MEDIF",    desc: "20 airlines — requirements, form downloads, and auto-fill.",       t: "meda",   col: C.red,    bg: "#fff1f1" },
            ].map(({ icon, title, desc, t, col, bg }) => (
              <div key={t} className="hov" onClick={() => { if (!ac) newCase(); else { setTool(t); setScreen("case"); } }}
                style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 22, cursor: "pointer", transition: "all 0.18s" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: col, marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
          {cases.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, fontWeight: 700 }}>Recent Cases</div>
              {cases.slice(0, 4).map(ca => (
                <div key={ca.id} className="hov" onClick={() => openCase(ca)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 16px", marginBottom: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ca.patientName || "Unnamed"} {ca.caseNo && <span style={{ color: C.muted, fontWeight: 400 }}>· {ca.caseNo}</span>}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ca.fromCity && ca.toCity ? `${ca.fromCity} → ${ca.toCity}` : "Route TBC"} · {new Date(ca.updated).toLocaleDateString("en-AU")}</div>
                  </div>
                  <span style={{ fontSize: 11, color: C.navy, fontWeight: 600 }}>Open →</span>
                </div>
              ))}
              {cases.length > 4 && <div style={{ fontSize: 12, color: C.muted, cursor: "pointer", textAlign: "center", padding: "8px 0" }} onClick={() => setScreen("cases")}>View all {cases.length} cases →</div>}
            </div>
          )}
        </div>
      )}

      {/* CASES */}
      {screen === "cases" && (
        <div style={{ padding: "28px 24px", maxWidth: 760, margin: "0 auto" }} className="fade">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>All Cases</div>
            <PrimaryBtn onClick={newCase}>+ New Case</PrimaryBtn>
          </div>
          {cases.length === 0
            ? <div style={{ textAlign: "center", padding: 60, color: C.muted }}>No cases yet.</div>
            : cases.map(ca => (
              <div key={ca.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ cursor: "pointer", flex: 1 }} onClick={() => openCase(ca)}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{ca.patientName || "Unnamed"} <span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>{ca.caseNo ? `· ${ca.caseNo}` : ""}</span></div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{ca.diagnosis || "No diagnosis"} · {ca.fromCity && ca.toCity ? `${ca.fromCity} → ${ca.toCity}` : "Route TBC"}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <GhostBtn onClick={() => openCase(ca)} small>Open</GhostBtn>
                  <button onClick={() => delCase(ca.id)} style={{ background: "#fff0f0", border: "1.5px solid #fcc", color: C.red, borderRadius: 7, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* CASE WORKSPACE */}
      {screen === "case" && ac && (
        <div style={{ display: "flex", height: "calc(100vh - 58px)" }}>

          {/* Sidebar */}
          <div style={{ width: 170, background: C.white, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, paddingTop: 8 }}>
            {[
              { id: "brief",  icon: "📋", label: "Mission Brief" },
              { id: "quote",  icon: "💰", label: "Quote" },
              { id: "hotels", icon: "🏨", label: "Hotels" },
              { id: "meda",   icon: "📄", label: "MEDA Forms" },
            ].map(({ id, icon, label }) => (
              <button key={id} className={`tool-btn${tool === id ? " on" : ""}`} onClick={() => setTool(id)}>
                <span>{icon}</span><span>{label}</span>
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {grand > 0 && (
              <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.faint}`, background: "#f8fafc" }}>
                <div style={{ ...LBL }}>Est. Total</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginTop: 2 }}>AUD ${fmt(grand)}</div>
              </div>
            )}
          </div>

          {/* Main panel */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: C.bg }}>

            {/* ── MISSION BRIEF ── */}
            {tool === "brief" && (
              <div className="fade">
                <div style={CARD}>
                  <SH t="👤 Patient & Case Details" />
                  <G2>
                    <F label="Patient Name"  val={ac.patientName} onSave={sv("patientName")} />
                    <F label="Case Number"   val={ac.caseNo}      onSave={sv("caseNo")}      ph="SCA 000" />
                    <F label="Date of Birth" val={ac.dob}         onSave={sv("dob")}         type="date" />
                    <F label="Age"           val={ac.age}         onSave={sv("age")}         type="number" />
                    <FULL><F label="Diagnosis / Procedures" val={ac.diagnosis} onSave={sv("diagnosis")} rows={2} ph="Primary diagnosis..." /></FULL>
                    <Sel label="Mobility Status" val={ac.mobility} onChange={sv("mobility")} opts={[
                      { v: "ambulant",          l: "Ambulant — walks independently" },
                      { v: "ambulant-assisted", l: "Ambulant with assistance" },
                      { v: "wheelchair",        l: "Wheelchair dependent" },
                      { v: "stretcher",         l: "Stretcher / non-ambulant" },
                    ]} />
                    <F label="Patient Contact"         val={ac.patientContact} onSave={sv("patientContact")} />
                    <FULL><F label="Relevant Background"           val={ac.background} onSave={sv("background")} ph="Nil / PMHx..." /></FULL>
                    <FULL><F label="Family / Travelling Companion" val={ac.companion}  onSave={sv("companion")} /></FULL>
                  </G2>
                </div>

                <div style={CARD}>
                  <SH t="📍 Pickup Location" />
                  <G2>
                    <F label="Medical Facility" val={ac.pickupFacility} onSave={sv("pickupFacility")} />
                    <F label="Ward / Bed"       val={ac.pickupWard}     onSave={sv("pickupWard")} />
                    <FULL><F label="Full Address" val={ac.pickupAddress} onSave={sv("pickupAddress")} /></FULL>
                  </G2>
                </div>

                <div style={CARD}>
                  <SH t="🏥 Drop Off — Australia" />
                  <G2>
                    <F label="Primary Physician"  val={ac.dropPhysician} onSave={sv("dropPhysician")} />
                    <F label="Medical Facility"   val={ac.dropFacility}  onSave={sv("dropFacility")} />
                    <F label="Ward / Bed"         val={ac.dropWard}      onSave={sv("dropWard")} />
                    <F label="Phone"              val={ac.dropPhone}     onSave={sv("dropPhone")} />
                    <F label="Admission Details"  val={ac.dropAdmission} onSave={sv("dropAdmission")} />
                    <FULL><F label="Full Address" val={ac.dropAddress}   onSave={sv("dropAddress")} /></FULL>
                  </G2>
                </div>

                <div style={CARD}>
                  <SH t="🕐 Key Timeline" />
                  {[
                    ["Pre-flight Assessment",        "preFlightDate", "preFlightTime"],
                    ["Escort Arrive at Hospital",    "escortDate",    "escortTime"],
                    ["Escort & Patient Depart",      "departDate",    "departTime"],
                  ].map(([lbl, df, tf]) => (
                    <div key={df} style={{ marginBottom: 14 }}>
                      <label style={LBL}>{lbl}</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <F val={ac[df]} onSave={sv(df)} type="date" />
                        <F val={ac[tf]} onSave={sv(tf)} type="time" />
                      </div>
                    </div>
                  ))}
                  <F label="Airport → Hospital (escort independent)" val={ac.airportTransfer} onSave={sv("airportTransfer")} ph="e.g. Local taxi / Uber" />
                </div>

                <div style={CARD}>
                  <SH t="🏥 Medical & SCA Contacts" />
                  <F label="Special Equipment Required" val={ac.equipment}   onSave={sv("equipment")}   rows={3} ph={"Stretcher Kit\nSuction\nPortable Oxygen Concentrator"} />
                  <div style={{ marginTop: 14 }}>
                    <F label="SCA Contacts Whilst Away" val={ac.scaContacts} onSave={sv("scaContacts")} rows={3} />
                  </div>
                </div>

                <div style={CARD}>
                  <SH t="📋 Generate Mission Brief" />
                  <p style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>Generates a complete SCA-style brief from the case data above.</p>
                  <PrimaryBtn onClick={genBrief} disabled={briefBusy}>{briefBusy ? "Generating..." : "Generate Mission Brief"}</PrimaryBtn>
                  {briefBusy && <Spin msg="Generating mission brief..." />}
                  <ErrBox msg={briefErr} />
                  {brief && <OutBox text={brief} onCopy={() => cp(brief)} onRegen={genBrief} />}
                </div>
              </div>
            )}

            {/* ── QUOTE ── */}
            {tool === "quote" && (
              <div className="fade">
                <div style={CARD}>
                  <SH t="🏢 Referral & Route" />
                  <G2>
                    <F label="Referring Insurer / Company" val={ac.insurer}        onSave={sv("insurer")} />
                    <F label="Contact Name"                val={ac.insurerContact}  onSave={sv("insurerContact")} />
                    <F label="Origin City"                 val={ac.fromCity}        onSave={sv("fromCity")} />
                    <F label="Origin Country"              val={ac.fromCountry}     onSave={sv("fromCountry")} />
                    <F label="Destination City"            val={ac.toCity}          onSave={sv("toCity")} />
                    <F label="Destination State"           val={ac.toState}         onSave={sv("toState")} />
                    <F label="Earliest Travel Date"        val={ac.dateFrom}        onSave={sv("dateFrom")} type="date" />
                    <F label="Latest Travel Date"          val={ac.dateTo}          onSave={sv("dateTo")}   type="date" />
                  </G2>
                </div>

                <div style={CARD}>
                  <SH t="✈ Escorts & Flights" />
                  <div style={{ background: "#f0f6ff", border: `1px solid #d0e4f7`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#2c5282", marginBottom: 14 }}>
                    💡 Check Google Flights or Skyscanner for live prices, then enter below.
                  </div>
                  <G2>
                    <Sel label="Number of Escorts" val={ac.escorts} onChange={sv("escorts")} opts={["1","2","3"].map(v => ({ v, l: `${v} escort${v > "1" ? "s" : ""}` }))} />
                    <Sel label="Escort Type" val={ac.escortType} onChange={sv("escortType")} opts={["Registered Nurse","Critical Care Nurse","Paramedic","Flight Nurse + Paramedic","Doctor + Nurse"]} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={LBL}>Preferred Airline</label>
                      <select value={ac.airline || ""} onChange={e => sv("airline")(e.target.value)} style={INP}>
                        <option value="">Select airline...</option>
                        {AIRLINES.map(a => <option key={a.code} value={a.name}>{a.name} ({a.code})</option>)}
                        <option value="Other">Other / TBC</option>
                      </select>
                    </div>
                    <Sel label="Flight Class" val={ac.flightClass} onChange={sv("flightClass")} opts={["Economy","Premium Economy","Business","First"]} />
                    <F label="Escort Price AUD (per person)" val={ac.escortPrice}  onSave={sv("escortPrice")}  type="number" ph="2400" />
                    <F label="Patient Price AUD"             val={ac.patientPrice} onSave={sv("patientPrice")} type="number" ph="2400" />
                  </G2>
                  {ft > 0 && <div style={{ marginTop: 10, fontSize: 12, color: C.navy, fontWeight: 600 }}>Flight subtotal: AUD ${fmt(ft)}</div>}
                </div>

                <div style={CARD}>
                  <SH t="🏨 Hotel" />
                  <G2>
                    <Sel label="Hotel Required?" val={ac.hotelYes} onChange={sv("hotelYes")} opts={[{ v: "yes", l: "Yes" }, { v: "no", l: "No" }]} />
                    {ac.hotelYes === "yes" && <>
                      <Sel label="Hotel Location" val={ac.hotelSide} onChange={sv("hotelSide")} opts={[
                        { v: "origin",      l: "Near pickup hospital" },
                        { v: "destination", l: "Near receiving hospital" },
                        { v: "both",        l: "Both ends" },
                      ]} />
                      <F label="Nights" val={ac.nights}   onSave={sv("nights")}   type="number" />
                      <div>
                        <F label="Cost Per Night (AUD)" val={ac.nightRate} onSave={sv("nightRate")} type="number" ph="180" />
                        {selHotel && <div style={{ fontSize: 11, color: C.navy, marginTop: 4, fontWeight: 600 }}>✓ {selHotel.name} selected</div>}
                      </div>
                      <FULL>
                        <GhostBtn onClick={() => setTool("hotels")}>🏨 Find Hotels Near Hospital →</GhostBtn>
                      </FULL>
                    </>}
                  </G2>
                  {ht > 0 && <div style={{ marginTop: 10, fontSize: 12, color: C.navy, fontWeight: 600 }}>Hotel subtotal: AUD ${fmt(ht)}</div>}
                </div>

                <div style={CARD}>
                  <SH t="🚑 Transfers & Other Costs" />
                  <G2>
                    <Sel label="Transfers Required?" val={ac.transfersYes} onChange={sv("transfersYes")} opts={[{ v: "yes", l: "Yes" }, { v: "no", l: "No" }]} />
                    {ac.transfersYes === "yes" && <>
                      <F label="Number of Transfers" val={ac.numTransfers} onSave={sv("numTransfers")} type="number" />
                      <F label="Cost Each (AUD)"     val={ac.transferCost} onSave={sv("transferCost")} type="number" ph="450" />
                    </>}
                    <F label="Medical / Admin Fee (AUD)" val={ac.adminFee} onSave={sv("adminFee")} type="number" ph="350" />
                  </G2>
                  {tt > 0 && <div style={{ marginTop: 10, fontSize: 12, color: C.navy, fontWeight: 600 }}>Transfer subtotal: AUD ${fmt(tt)}</div>}
                </div>

                {grand > 0 && (
                  <div style={CARD}>
                    <SH t="💰 Cost Summary" />
                    {[["Flights", ft], ["Hotel", ht], ["Ground Transfers", tt], ["Medical / Admin", mt]].filter(([, v]) => v > 0).map(([l, v]) => (
                      <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.faint}`, fontSize: 13 }}>
                        <span style={{ color: C.sub }}>{l}</span>
                        <span style={{ fontWeight: 600 }}>AUD ${fmt(v)}</span>
                      </div>
                    ))}
                    <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyL})`, borderRadius: 10, padding: "14px 18px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                      <span style={{ fontWeight: 700 }}>TOTAL ESTIMATE</span>
                      <span style={{ fontSize: 20, fontWeight: 800 }}>AUD ${fmt(grand)}</span>
                    </div>
                  </div>
                )}

                <div style={CARD}>
                  <SH t="📄 Generate Quote Document" />
                  <p style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>Generates a professional insurer-ready quotation.</p>
                  <PrimaryBtn onClick={genQuote} disabled={quoteBusy}>{quoteBusy ? "Generating..." : "Generate Insurer Quote"}</PrimaryBtn>
                  {quoteBusy && <Spin msg="Generating insurer quotation..." />}
                  <ErrBox msg={quoteErr} />
                  {quote && <OutBox text={quote} onCopy={() => cp(quote)} onRegen={genQuote} />}
                </div>
              </div>
            )}

            {/* ── HOTELS ── */}
            {tool === "hotels" && (
              <div className="fade">
                <div style={CARD}>
                  <SH t="🏨 Hotel Finder — Near Hospital" />
                  <p style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>Find hotels near the hospital. Select one to auto-populate the nightly rate into your quote.</p>
                  <div style={{ background: "#f0f6ff", border: "1px solid #d0e4f7", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#2c5282", marginBottom: 16 }}>
                    💡 Use the full hospital name including city and country for best results — e.g. <em>"Austin Hospital, Heidelberg, Victoria, Australia"</em>
                  </div>
                  <G2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={LBL}>Search Near</label>
                      <select value={hotelSide} onChange={e => setHotelSide(e.target.value)} style={INP}>
                        <option value="origin">Pickup Hospital ({ac.fromCity || "origin"})</option>
                        <option value="destination">Receiving Hospital ({ac.toCity || "destination"})</option>
                      </select>
                    </div>
                    <Sel label="Max Distance" val={ac.radiusKm} onChange={sv("radiusKm")} opts={["1","2","3","5"].map(v => ({ v, l: `${v} km` }))} />
                  </G2>
                  <div style={{ marginTop: 14, marginBottom: 16 }}>
                    <label style={LBL}>{hotelSide === "origin" ? "Pickup" : "Receiving"} Hospital (full name + city + country)</label>
                    <input
                      key={hotelSide}
                      defaultValue={hotelSide === "origin" ? ac.pickupHospital || "" : ac.dropHospital || ""}
                      onBlur={e => sv(hotelSide === "origin" ? "pickupHospital" : "dropHospital")(e.target.value)}
                      placeholder={hotelSide === "origin"
                        ? "e.g. Dr. Nelio Mendonça Hospital, Funchal, Madeira, Portugal"
                        : "e.g. Austin Hospital, Heidelberg, Victoria, Australia"}
                      style={INP}
                    />
                  </div>
                  <PrimaryBtn onClick={findHotels} disabled={hotelBusy}>{hotelBusy ? "Searching..." : `Search Hotels within ${ac.radiusKm || 3}km`}</PrimaryBtn>
                </div>

                {hotelBusy && <Spin msg="Searching for hotels near hospital..." />}
                <ErrBox msg={hotelErr} />

                {hotels.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {hotels.length} hotels found · click to select
                    </div>
                    {hotels.map((h, i) => (
                      <div key={i}
                        onClick={() => { setSelHotel(h); sv("nightRate")(String(h.rateAUD)); }}
                        style={{
                          background: selHotel?.name === h.name ? "#f0f6ff" : C.white,
                          border: `1.5px solid ${selHotel?.name === h.name ? C.navy : C.border}`,
                          borderRadius: 10, padding: 16, cursor: "pointer", marginBottom: 10,
                          transition: "all 0.15s",
                        }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{h.name}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{"★".repeat(Math.min(5, Math.round(h.stars || 3)))} · {h.distanceKm}km from hospital</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 800, color: C.navy, fontSize: 17 }}>~AUD ${h.rateAUD}</div>
                            <div style={{ fontSize: 10, color: C.muted }}>per night</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: C.sub, marginBottom: 8 }}>{h.suitability}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: selHotel?.name === h.name ? C.navy : C.muted, fontWeight: selHotel?.name === h.name ? 700 : 400 }}>
                            {selHotel?.name === h.name ? "✓ Selected — rate applied to quote" : "Click to select"}
                          </span>
                          <a href={h.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ fontSize: 11, color: C.navyL, textDecoration: "none", fontWeight: 600 }}>
                            View on Maps →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── MEDA ── */}
            {tool === "meda" && (
              <div className="fade">
                {!medaAirline ? (
                  <div style={CARD}>
                    <SH t="📄 MEDA / MEDIF — 20 Airlines" />
                    <p style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>Select an airline to view requirements, download the form, and auto-fill from case data.</p>
                    <input
                      value={medaQ}
                      onChange={e => setMedaQ(e.target.value)}
                      placeholder="Search airline or IATA code..."
                      style={{ ...INP, marginBottom: 16 }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {filteredAirlines.map(a => (
                        <div key={a.code}
                          onClick={() => { setMedaAirline(a); setMeda(""); setMedaErr(""); }}
                          className="hov"
                          style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: 14, cursor: "pointer", transition: "all 0.15s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13 }}>{a.name}</div>
                              <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>{a.code} · {a.formName}</div>
                            </div>
                            <span style={{ fontSize: 20 }}>{a.logo}</span>
                          </div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", background: a.stretch ? "#e8f5e9" : "#fce8e8", color: a.stretch ? C.green : C.red }}>STRETCHER {a.stretch ? "✓" : "✗"}</span>
                            <span style={{ fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px", background: a.equip ? "#e8f5e9" : "#fce8e8", color: a.equip ? C.green : C.red }}>MED EQUIP {a.equip ? "✓" : "✗"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="fade">
                    <button onClick={() => { setMedaAirline(null); setMeda(""); setMedaErr(""); }}
                      style={{ background: "none", border: "none", color: C.sub, fontSize: 12, cursor: "pointer", marginBottom: 14, fontFamily: "inherit", fontWeight: 600 }}>
                      ← All Airlines
                    </button>
                    <div style={CARD}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{medaAirline.name} <span style={{ color: C.muted, fontWeight: 400, fontSize: 13 }}>({medaAirline.code})</span></div>
                          <div style={{ fontSize: 12, color: C.navy, fontWeight: 600, marginTop: 3 }}>{medaAirline.formName}</div>
                        </div>
                        <span style={{ fontSize: 32 }}>{medaAirline.logo}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.sub, marginBottom: 16, lineHeight: 1.7, background: "#f8fafc", padding: "10px 14px", borderRadius: 8 }}>{medaAirline.notes}</div>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ ...LBL, marginBottom: 8 }}>Documentation Required</div>
                        {medaAirline.requirements.map((r, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#3d5a7a", marginBottom: 6 }}>
                            <span style={{ color: C.navy }}>▸</span>{r}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, marginBottom: 16 }}>
                        <span style={{ ...LBL, display: "inline" }}>Lead Time: </span>
                        <span style={{ fontWeight: 700, color: C.red, marginLeft: 6 }}>{medaAirline.leadTime}</span>
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <a href={medaAirline.formUrl} target="_blank" rel="noopener noreferrer"
                          style={{ background: `linear-gradient(135deg,${C.navy},${C.navyL})`, borderRadius: 8, padding: "9px 18px", color: "#fff", fontWeight: 700, fontSize: 12, textDecoration: "none", display: "inline-block" }}>
                          Download Official Form →
                        </a>
                        <a href={medaAirline.pageUrl} target="_blank" rel="noopener noreferrer"
                          style={{ background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "9px 18px", color: C.sub, fontWeight: 600, fontSize: 12, textDecoration: "none", display: "inline-block" }}>
                          Airline Medical Page →
                        </a>
                        <GhostBtn onClick={() => genMeda(medaAirline)} small>{medaBusy ? "Generating..." : "Auto-fill from Case Data"}</GhostBtn>
                      </div>
                    </div>
                    {medaBusy && <Spin msg="Pre-filling MEDIF from case data..." />}
                    <ErrBox msg={medaErr} />
                    {meda && (
                      <div style={CARD}>
                        <SH t="Pre-filled Form — Review Before Sending to Physician" />
                        <OutBox text={meda} onCopy={() => cp(meda)} onRegen={() => genMeda(medaAirline)} />
                      </div>
                    )}
                    {!meda && !medaBusy && !medaErr && ac?.patientName && (
                      <div style={{ background: "#f0f6ff", border: "1px solid #d0e4f7", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#2c5282" }}>
                        Click <strong>Auto-fill from Case Data</strong> to pre-populate this MEDIF with {ac.patientName}'s details. Review then send to treating physician for signature.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
