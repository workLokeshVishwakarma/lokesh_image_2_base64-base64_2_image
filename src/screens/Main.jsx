import { useState, useRef } from "react";

const dataToBlob = async (imageData) => await (await fetch(imageData)).blob();

const Main = () => {
  const imgEl_ref = useRef(null);
  const preview__p_ref = useRef(null);
  const [imgEl_src, setImgEl_src] = useState("");
  const [textareaBase64Val, setTextareaBase64Val] = useState("");
  const [selectImageBtnText, setSelectImageBtnText] = useState("Select Image");
  const [downloadBtnTExt, setDownloadBtnTExt] = useState({
    class: "disabled",
    href: "",
    download: "",
  });

  const setElImage2Base64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setTextareaBase64Val(reader.result);
  };

  const handleOnChangeFile = (event) => {
    preview__p_ref.current.style.display = "none";
    setSelectImageBtnText("Re-Select Image");
    setImgEl_src(URL.createObjectURL(event.target.files[0]));
    imgEl_ref.current.style.display = "block";
    setElImage2Base64(event.target.files[0]);
  };

  const handleOnChangeBase64TextArea = async (event) => {
    try {
      if (!event.target.value) {
        setImgEl_src("");
        imgEl_ref.current.style.display = "none";
        preview__p_ref.current.style.display = "block";
        setSelectImageBtnText("Select Image");
        setDownloadBtnTExt((prev) => ({
          ...prev,
          class: "disabled",
        }));
        return false;
      }
      const blob = await dataToBlob(event.target.value);
      const blobUrl = URL.createObjectURL(blob);
      preview__p_ref.current.style.display = "none";
      setImgEl_src(blobUrl);
      imgEl_ref.current.style.display = "block";
      setDownloadBtnTExt((prev) => ({
        ...prev,
        href: blobUrl,
        class: "active",
        download: `image.${event.target.value.split(";")[0].split("/")[1]}`,
      }));
    } catch (error) {
      setDownloadBtnTExt((prev) => ({
        ...prev,
        class: "disabled",
      }));
    }
  };

  return (
    <>
      <div className="container">
        <section>
          <div className="image-preview-container">
            <div className="preview">
              <p style={{ marginBottom: "1rem" }} ref={preview__p_ref}>
                Please Select An Image
              </p>
              <img
                style={{ display: "none" }}
                id="preview-selected-image"
                alt="Something Went Wrong"
                src={imgEl_src}
                ref={imgEl_ref}
                onError={() => {
                  setDownloadBtnTExt((prev) => ({
                    ...prev,
                    class: "disabled",
                  }));
                }}
              />
            </div>
            <label id="selectImageBtn" tabIndex="1" htmlFor="file-upload">
              {selectImageBtnText}
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleOnChangeFile(e)}
            />
          </div>
        </section>
        <section>
          <a
            id="downloadBtn"
            className={downloadBtnTExt.class}
            tabIndex="1"
            href={downloadBtnTExt.href}
            download={downloadBtnTExt.download}
            onClick={(e) => {
              !downloadBtnTExt.href && e.preventDefault();
            }}
          >
            <i className="fa fa-download"></i>&nbsp;&nbsp;Download-Image
          </a>
        </section>
        <section>
          <div className="base64TextConatiner">
            <textarea
              tabIndex="1"
              id="base64TextArea"
              cols="30"
              rows="10"
              value={textareaBase64Val}
              onChange={(e) => setTextareaBase64Val(e.target.value)}
              onInput={(e) => handleOnChangeBase64TextArea(e)}
              placeholder="Or Paste Base64"
            ></textarea>
          </div>
        </section>
      </div>
    </>
  );
};

export default Main;
