import React from "react";
import DocItemFooter from "@theme-original/DocItem/Footer";
import TranslateButton from "../../../components/TranslateButton";

export default function DocItemFooterWrapper(props) {
  return (
    <>
      {/* Add translate button before footer */}
      <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
        <TranslateButton />
      </div>
      <DocItemFooter {...props} />
    </>
  );
}
