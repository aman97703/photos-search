import { Box, Modal } from "@mui/material";
import React from "react";
import Loader from "./Loader";
import { Cancel } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: "400px",
  maxHeight: "75vh",
  maxWidth: "90%",
  bgcolor: "white",
  boxShadow: 24,
  outline: "none",
  p: 4,
  borderRadius: 3,
};

const ImageModal = ({ open, setOpen, image }) => {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="position-relative">
            {image ? (
              <div className="img-container image_modal">
                <img src={image} alt="ficker" className="img-fluid" />
              </div>
            ) : (
              <Loader />
            )}
            <button className="modal_close" onClick={handleClose}>
              <Cancel />
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ImageModal;
