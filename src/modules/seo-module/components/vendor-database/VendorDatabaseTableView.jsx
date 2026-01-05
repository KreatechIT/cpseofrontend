import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { InfoIcon, Edit, Trash2,  Building2, Mail, Phone, Eye, EyeOff,  } from "lucide-react";
import { setDialogData } from "@/store/reducers/dialogSlice";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DeleteVendorConfirmation from "./DeleteVendorConfirmation"; // Adjust path
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorDatabaseTableView = ({ filteredVendors }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleDeleteClick = (vendor) => {
    setSelectedVendor(vendor);
    setDeleteOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border" style={{background: "#3872FA33"}}>
          <TableRow>
            <TableHead className="p-3">Vendor Name</TableHead>
            <TableHead>Vendor Type</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredVendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 rounded-full border border-black/10">
                    <AvatarImage
                      src={vendor?.logo || vendor?.image}
                      alt={vendor?.vendor_name}
                      className="h-full w-full rounded-full object-cover border"
                    />
                    <AvatarFallback className="dark:bg-white/10">
                      <Building2 size={22} className="opacity-60" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                  {vendor?.vendor_name}
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="outline">
                  {vendor?.vendor_type_name || vendor?.type_name || "-"}
                </Badge>
              </TableCell>

              <TableCell>{vendor?.contact_person || "-"}</TableCell>
              <TableCell>{vendor?.company_name || "-"}</TableCell>
              <TableCell>{vendor?.email || "-"}</TableCell>
              <TableCell>{vendor?.phone || vendor?.contact_number || "-"}</TableCell>

              <TableCell>
                <div className="flex gap-2">
                  {/* <Button
                    variant="outline"
                    size="xs"
                    className="flex-grow"
                    onClick={() => {
                      dispatch(
                        setDialogData({
                          type: "vendorDetailedView",
                          props: vendor,
                          styles: "md:min-w-[750px] lg:min-w-[850px]",
                        })
                      );
                    }}
                  >
                    <InfoIcon className="mr-1 h-4 w-4" />
                    View Details
                  </Button> */}

                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => navigate(`/seo/vendor/vendor-details/edit/${vendor.id}`)} // Adjust path
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => handleDeleteClick(vendor)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {filteredVendors.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No vendors found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DeleteVendorConfirmation 
            vendor={selectedVendor} 
            onClose={() => setDeleteOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorDatabaseTableView;