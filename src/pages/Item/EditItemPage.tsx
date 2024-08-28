import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BiSolidCloudUpload, BiLoaderAlt } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
<<<<<<< HEAD
=======
  updateDoc,
>>>>>>> 1dcdb2a71ce5a7b6f77404e2cccfd5d63131dae7
  where,
} from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CategoriesContext } from "../../App";
import { firestore, storage } from "../../../firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Retailer } from "../../store/types";
import { deleteItem, updateItem } from "../../utils/firebaseFunctions";
import { toast } from "react-toastify";

// Validation schema (same as AddItemPage)
const formSchema = z.object({
  id: z.string().min(1, { message: "ID not there" }),
  title: z.string().min(1, { message: "Title is required!!" }),
  imageUrl: z.string().min(1, { message: "Image is required!!" }),
  price: z.string().min(1, { message: "Price is required!!" }),
  description: z.string().min(1, { message: "Description is required!!" }),
  category: z.string().min(1, { message: "Category is required!!" }),
  retailer: z.string().min(1, { message: "Retailer is required!!" }),
  quantity: z.string().min(1, { message: "Quantity is required!!" }),
  //   category: z.enum(categories),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the item ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  //   const [itemData, setItemData] = useState<any>(null);
  const categories = useContext(CategoriesContext);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>("");
  const retailerId = localStorage.getItem("uid");
  const userRole = localStorage.getItem("userRole");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "retailers"));
        // const retailersList = querySnapshot.docs.map((doc) => doc.data().name);
        const retailerList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Retailer[];
        setRetailers(retailerList);
        // Query Firestore for the specific retailer based on the retailerId
        const q = query(
          collection(firestore, "retailers"),
          where("id", "==", retailerId)
        );
        const querySnap = await getDocs(q);

        // Filter the fetched retailers to find the one with the matching retailerId
        const fetchedRetailers = querySnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((retailer) => retailer.id === retailerId); // Filter for the specific retailerId

        if (fetchedRetailers.length > 0) {
          setSelectedRetailer(fetchedRetailers[0].id);
        }
      } catch (error) {
        console.error("Error fetching retailers: ", error);
      }
    };

    const fetchItemData = async () => {
      // Ensure that `id` is a non-null string
      if (!id) {
        throw new Error("Document ID is required");
      }
      console.log("itemid: ", id);

      const docRef = doc(firestore, "items", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // setItemData(docSnap.data());
        setFormValues(data); // Populate the form fields
        setLoading(false);
      } else {
        console.log("No such document!");
        navigate("/404");
      }
    };

    fetchRetailers();
    fetchItemData();
  }, [id, navigate]);

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      if (id) {
        // const docRef = doc(firestore, "items", id);
        // await updateDoc(docRef, data);
        await updateItem(data);
        toast.success("Item updated successfully!");
        setTimeout(() => {
          if (userRole == "admin") navigate("/itemlist");
          // Redirect to items list after successful update
          else navigate("/myitemlist");
        }, 100); // Delay navigation slightly to allow alert to show
      } else {
        console.log("No ID provided");
        toast.warning("No ID provided");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error(`Error updating document: ${error}`);
    }
  };

  const setFormValues = (data: any) => {
    setValue("id", data.id);
    setValue("title", data.title);
    setValue("quantity", data.quantity);
    setValue("category", data.category);
    setValue("retailer", data.retailer);
    setValue("price", data.price);
    setValue("description", data.description);
    setValue("imageUrl", data.imageUrl);
    setImageUrl(data.imageUrl);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getImageUrl = (files: any, onChangeReactHookForm: any) => {
    setIsImageUploading(true);
    const imageFile = files[0];
    if (!imageFile) return null;
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload pogress : ", uploadProgress);
      },
      (error) => {
        console.log("Error while uploading image : ", error);
        setIsImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          console.log("url", downloadUrl);
          setImageUrl(downloadUrl);
          onChangeReactHookForm(downloadUrl);
          setIsImageUploading(false);
        });
      }
    );
  };

  const removeImage = () => {
    if (!imageUrl) return null;
    const deleteRef = ref(storage, imageUrl);
    deleteObject(deleteRef).then(() => {
      setImageUrl(null);
    });
  };

  const handleDelete = async () => {
    try {
      if (id) {
        removeImage();
        await deleteItem(id);
        toast.success(`Item deleted successfully! ID: ${id}`);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error(`Error deleting document: ${error}`);
    }
    setTimeout(() => {
      if (userRole == "admin") navigate("/itemlist");
      // Redirect to items list after successful update
      else navigate("/myitemlist");
    }, 100); // Delay navigation slightly to allow alert to show
  };

  return (
    <div className="w-full flex justify-center items-center bg-contain bg-no-repeat bg-[url('/images/add-item-bg.png')]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="z-10 backdrop-blur-lg w-[600px] border border-gray-400 rounded-md p-4 flex flex-col gap-4 shadow-xl"
      >
        {/* <div className="flex flex-col gap-2 relative">
          <label htmlFor="id" className="text-lg font-medium">
            ID
          </label>
          <input
            {...register("id")}
            type="text"
            className="text-lg px-2 py-1 ring-1 ring-gray-400 outline-primary"
          />
          {errors.id && errors.id.message && (
            <span className="absolute top-2 right-2 text-red-600 text-xs">
              {errors.id.message}
            </span>
          )}
        </div> */}
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="title" className="text-lg font-medium">
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            className="text-lg px-2 py-1 ring-1 ring-gray-400 outline-primary"
          />
          {errors.title && errors.title.message && (
            <span className="absolute top-2 right-2 text-red-600 text-xs">
              {errors.title.message}
            </span>
          )}
        </div>

        <div
          className={`${
            errors.imageUrl?.message ? "border-red-600" : "border-gray-500"
          } w-full h-44 bg-white border flex items-center justify-center`}
        >
          {isImageUploading ? (
            <BiLoaderAlt className="text-3xl animate-spin text-primary" />
          ) : imageUrl ? (
            <div className="h-full w-full flex items-center justify-center relative">
              <img
                src={imageUrl}
                alt="input-image"
                className="h-full object-contain"
              />
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeImage}
                type="button"
                className="absolute top-2 right-2"
              >
                <RxCross2 className="text-2xl text-red-600" />
              </motion.button>
            </div>
          ) : (
            <label className="w-full h-full relative cursor-pointer flex flex-col gap-2 items-center justify-center ">
              <BiSolidCloudUpload className="text-3xl" />
              <p className="select-none">Upload Image</p>
              <Controller
                control={control}
                name="imageUrl"
                render={({ field: { onChange, onBlur } }) => (
                  <input
                    onBlur={onBlur}
                    onChange={(e) => {
                      getImageUrl(e.target.files, onChange);
                    }}
                    type="file"
                    className="sr-only"
                  />
                )}
              />
              {errors.imageUrl?.message && (
                <span className="absolute top-2 right-2 text-red-600 text-xs">
                  {errors.imageUrl?.message}
                </span>
              )}
            </label>
          )}
        </div>

        <div>
          <label htmlFor="category" className="text-lg font-medium">
            Category:
          </label>
          <select
            {...register("category")}
            name="category"
            id="category"
            placeholder="Select category"
            className="capitalize mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            defaultValue=""
            // onChange={(e) => setSelectedCategories(e.target.value)}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="capitalize hover:bg-primary cursor-pointer"
              >
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="retailer" className="text-lg font-medium">
            Retailer:
          </label>
          <select
            {...register("retailer")}
            name="retailer"
            id="retailer"
            value={userRole == "retailer" ? selectedRetailer || "" : undefined}
            disabled={userRole == "retailer" ? true : false}
            // onChange={(e) => setSelectedRetailer(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select Retailer
            </option>
            {retailers.map((retailer) => (
              <option key={retailer.id} value={retailer.id}>
                {retailer.name}
              </option>
            ))}
          </select>
          {/* {errors.retailer && (
            <span className="absolute top-2 right-2 text-red-600 text-xs">
              {errors.retailer.message}
            </span>
          )} */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="price" className="text-lg font-medium">
              Price ₹
            </label>
            <input
              type="text"
              {...register("price")}
              className="text-lg px-2 py-1 ring-1 ring-gray-400 outline-primary"
            />
            {errors.price?.message && (
              <span className="absolute top-2 right-2 text-red-600 text-xs">
                {errors.price.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <label htmlFor="quantity" className="text-lg font-medium">
              Quantity
            </label>
            <input
              type="text"
              {...register("quantity")}
              className="text-lg px-2 py-1 ring-1 ring-gray-400 outline-primary"
            />
            {errors.quantity?.message && (
              <span className="absolute top-2 right-2 text-red-600 text-xs">
                {errors.quantity.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <label htmlFor="description" className="text-lg font-medium">
            Description
          </label>
          <input
            {...register("description")}
            type="text"
            className="text-lg px-2 py-1 ring-1 ring-gray-400 outline-primary"
          />
          {errors.description?.message && (
            <span className="absolute top-2 right-2 text-red-600 text-xs">
              {errors.description.message}
            </span>
          )}
        </div>
        <ul>
          {Object.entries(errors).map(([field, error]) => (
            <li key={field}>{error?.message}</li>
          ))}
        </ul>
        <div className="flex space-x-4 justify-center">
          <motion.button
            whileTap={{
              scale: 0.95,
            }}
            disabled={isSubmitting}
            type="submit"
            className="disabled:bg-blue-500 text-lg font-semibold tracking-wide bg-primary p-2 text-white hover:bg-primaryHover"
          >
            Update Item
          </motion.button>
          <motion.button
            whileTap={{
              scale: 0.95,
            }}
            type="button"
            onClick={() => handleDelete()}
            className="disabled:bg-red-500 text-lg font-semibold tracking-wide bg-primary p-2 text-white hover:bg-primaryHover"
          >
            Delete Item
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default EditItemPage;
