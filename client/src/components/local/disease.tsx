import { useForm } from "react-hook-form";
import Header from "./header";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { env } from "../../config";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface DiseaseState {
  diseaseId: number;
  name: string;
  symptoms: string;
}

export default function Diseases() {
  const [diseaseData, setDiseaseData] = useState<DiseaseState[]>();

  const fetchDiseases = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Diseases`).then((res) => {
      setDiseaseData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const onDeleteDisease = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Diseases/${tableId}`).then(() => {
        fetchDiseases();
      });
    },
    [fetchDiseases]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddDiseaseComponent
          fetchDiseases={fetchDiseases}
        ></AddDiseaseComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Disease Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {diseaseData?.map((disease) => (
              <TableRow key={disease.diseaseId}>
                <TableCell>{disease.diseaseId}</TableCell>
                <TableCell>{disease.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteDisease(disease.diseaseId)}
                  >
                    <Trash></Trash>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

interface AddDiseaseComponentProps {
  fetchDiseases: () => void;
}

export function AddDiseaseComponent(props: AddDiseaseComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    symptoms: z
      .string({ required_error: "Symptoms is required" })
      .min(1)
      .max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddDisease = useCallback(async () => {
    const diseaseData = {
      name: form.getValues().name,
      symptoms: form.getValues().symptoms,
    };
    await axios.post(`${env.SERVER_URL}/api/Diseases`, diseaseData);
    form.reset();
    form.setValue("name", "");
    form.setValue("symptoms", "");
    props.fetchDiseases();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Disease</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Disease</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disease Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Disease Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disease Symptoms</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Disease Symptoms" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              onClick={onAddDisease}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
