import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface LongMenuProps {
  addressId?: string;
  onDelete?: (id: string) => void; // Callback function for delete
  onEdit?: (id: string) => void;
}

const ITEM_HEIGHT = 48;

const LongMenu: React.FC<LongMenuProps> = ({ addressId, onDelete, onEdit }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // handle edit btn
  const handleEdit = () => {
    if (addressId && onEdit) {
      onEdit(addressId); // Call the delete function with addressId
    }
    handleClose();
  };

  // handle the delete btn
  const handleDeleteAddress = () => {
    if (addressId && onDelete) {
      onDelete(addressId); // Call the delete function with addressId
    }
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteAddress}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default LongMenu;
