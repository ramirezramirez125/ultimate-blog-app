import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { GlobalContext } from "../../contexts/GlobalContext";
import { trpc } from "../../utils/trpc";
import AutoComplete, { type Option } from "../ComboBox/MultiSelectAutoComplete";
import Modal from "../Modal";
import { FaTimes } from "react-icons/fa";
import Tag from "../Tag";

interface IFormInputs {
  title: string;
  description: string;
  text: string;
}

export const postSchema = z.object({
  title: z.string().min(20).max(40),
  description: z.string().min(95).max(200),
  text: z.string().min(80),
});

export const ErrorMessage = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <div className="w-full break-words text-sm text-red-500">
      <p>{errorMessage}</p>
    </div>
  );
};

type FormModalProps = {
  openModal: boolean;
  closeModal: () => void;
};

const FormModal = ({ openModal, closeModal }: FormModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    resolver: zodResolver(postSchema),
  });

  const utils = trpc.useContext();

  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      utils.post.getPosts.invalidate();
      toast.success("yey 🥳, post created successfully!");
      closeModal();
      reset();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { setOpenTagModal } = useContext(GlobalContext);

  const { data: tags } = trpc.tag.getTags.useQuery();

  const [selectedTags, setSelectedTags] = useState<Option[]>([]);

  return (
    <Modal isOpen={openModal} onClose={closeModal}>
      <form
        onSubmit={handleSubmit((data) =>
          createPost.mutate({
            ...data,
            tagIds: selectedTags.map((tag) => ({ id: tag.id })),
          })
        )}
        className="grid grid-cols-1 gap-y-2"
      >
        {tags && (
          <div className="flex items-center">
            <div className="mr-4 flex-1">
              <AutoComplete
                options={tags?.map((tag) => ({
                  label: tag.name,
                  id: tag.id,
                }))}
                selectedOptions={selectedTags}
                setSelectedOptions={setSelectedTags}
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setOpenTagModal(true)}
                disabled={createPost.isLoading}
                className="flex items-center space-x-2 rounded-lg px-4 py-3 ring-1 ring-gray-400"
              >
                New Tag
              </button>
            </div>
          </div>
        )}
        <div className="flex w-full flex-wrap space-x-2">
          {selectedTags.map((tag) => (
            <Tag
              key={tag.id}
              name={tag.label}
              onClick={() => {
                setSelectedTags((pre) => pre.filter((t) => t.id !== tag.id));
              }}
              Icon={FaTimes}
            />
          ))}
        </div>
        <input
          type="text"
          {...register("title")}
          placeholder="title"
          className="w-full rounded-lg border p-4 shadow outline-none focus:border-gray-600"
          disabled={createPost.isLoading}
        />
        <ErrorMessage errorMessage={errors.title?.message} />
        <input
          type="text"
          {...register("description")}
          placeholder="short description"
          className="w-full rounded-lg border p-4 shadow outline-none focus:border-gray-600"
          disabled={createPost.isLoading}
        />
        <ErrorMessage errorMessage={errors.description?.message} />
        <textarea
          cols={30}
          rows={10}
          className="w-full rounded-lg border p-4 shadow outline-none focus:border-gray-600"
          placeholder="write your text here..."
          disabled={createPost.isLoading}
          {...register("text")}
        />
        <ErrorMessage errorMessage={errors.text?.message} />
        <div className="flex justify-end">
          <button
            type={"submit"}
            disabled={createPost.isLoading}
            className="flex items-center space-x-2 rounded-lg px-4 py-2 ring-1 ring-gray-400"
          >
            {createPost.isLoading ? "Loading..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
