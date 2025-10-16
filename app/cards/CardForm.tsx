"use client";

import { useState } from "react";
import { TextInput, Textarea, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  onSubmit: (data: { question: string; answer: string }) => void;
  initialData?: { question: string; answer: string };
};

export default function CardForm({ onSubmit, initialData }: Props) {
  const form = useForm({
    initialValues: {
      question: initialData?.question ?? "",
      answer: initialData?.answer ?? "",
    },
    validate: {
      question: (v) => (v.trim() ? null : "Question is required"),
      answer: (v) => (v.trim() ? null : "Answer is required"),
    },
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    onSubmit(values);
    setLoading(false);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Question"
          {...form.getInputProps("question")}
          required
        />
        <Textarea label="Answer" {...form.getInputProps("answer")} required />
        <Button type="submit" loading={loading}>
          Save Card
        </Button>
      </Stack>
    </form>
  );
}
