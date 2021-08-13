import React, { useState, useEffect } from "react";

export default function Snooper(props) {
  const [spoofActive, setSpoofActive] = useState(false);
  const [spoofURL, setSpoofURL] = useState("");
  return (
    <div>
      <header>
        <div>Spoof {spoofActive ? "Active" : "Inactive"}</div>
        {
            spoofActive &&
            <div>Spoofing at spoofURL</div>
        }
      </header>
    </div>
  );
}
