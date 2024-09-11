import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiSolidCloudUpload, BiLoaderAlt } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firestore, storage } from "../../../firebase.config";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { saveItem } from "../../utils/firebaseFunctions";
import { CategoriesContext } from "../../App";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Retailer } from "../../store/types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// export const categories = [
//   "fruits",
//   "food",
//   "groceries",
//   "vegetables",
//   "fashion",
//   "mobile accessories",
//   "icecreams",
//   "meet",
//   "drinks",
// ] as const;

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required!!" }),
  imageUrl: z.string().min(1, { message: "Image is required!!" }),
  price: z.string().min(1, { message: "Price is required!!" }),
  description: z.string().min(1, { message: "Description is required!!" }),
  category: z.string().min(1, { message: "Category is required!!" }),
  retailer: z.string().min(1, { message: "Retailer is required!!" }),
  quantity: z.string().min(1, { message: "Quantity is required!!" }),
  // calories: z.string().min(1, { message: "Calories is required!!" }),
  // category: z.enum(categories),
});

type FormSchemaType = z.infer<typeof formSchema>;

const AddItemPage = () => {
  const navigate = useNavigate();
  const categories = useContext(CategoriesContext);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setValue,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  // @ts-ignore
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>("");
  // const [selectedCategories, setSelectedCategories] = useState<string>("");
  const retailerId = localStorage.getItem("uid");
  const userRole = localStorage.getItem("userRole");

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
          setValue("retailer", fetchedRetailers[0].id);
        }
      } catch (error) {
        console.error("Error fetching retailers: ", error);
      }
    };

    fetchRetailers();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const itemData = { id: crypto.randomUUID(), ...data };
      saveItem(itemData);
      toast.success("Item added successfully!");
      reset();
      setImageUrl(null);
    } catch (error) {
      console.log("Error while submiting the form: ", error);
      toast.error(`Error while submiting the form: ${error}`);
    }
    setTimeout(() => {
      if (userRole == "admin")
        navigate("/itemlist"); // Redirect to items list after successful update
      else navigate("/myitemlist");
    }, 100); // Delay navigation slightly to allow alert to show
  });

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
  return (
    <div className="w-full flex justify-center items-center bg-contain bg-no-repeat bg-[url('/images/add-item-bg.png')]">
      <form
        onSubmit={onSubmit}
        className="z-10 backdrop-blur-lg w-[600px] border border-gray-400 rounded-md p-4 flex flex-col gap-4 shadow-xl"
      >
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="title" className="text-lg font-medium">
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            className="text-lg px-2 py-1 ring-1 ring-gray-400 outline-primary"
          />
          {errors.title?.message && (
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
            // value={userRole == "retailer" ? selectedRetailer || "" : ""}
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
          {errors.retailer && (
            <span className="absolute top-2 right-2 text-red-600 text-xs">
              {errors.retailer.message}
            </span>
          )}
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
        <motion.button
          whileTap={{
            scale: 0.95,
          }}
          disabled={isSubmitting}
          className="disabled:bg-blue-500 text-lg font-semibold tracking-wide bg-primary p-2 text-white hover:bg-primaryHover"
        >
          Submit
        </motion.button>
      </form>
    </div>
  );
};

export default AddItemPage;
