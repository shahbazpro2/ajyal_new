import React, { useState } from "react";


export default (props) => {
  // const lang = useSelector(selectLang);
  // const curr = useSelector(selectCurr);
  // const [htmlStr, setHtmlStr] = useState(null);

  return (
    <div style={{padding: '0 10px'}}>
      <div dangerouslySetInnerHTML={{ __html: props.htmlStr }}></div>
    </div>
  );
};
