import { readerModel } from "../models/readers.model.js";

export const getAllReaders = async (req, res) => {
    try {
        const readers = await readerModel.find();
        res.status(200).json(readers);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getReaderById = async (req, res) => {
    try {
        const { id } = req.params;
        const reader = await readerModel.findById(id);
        if (!reader) {
            return res.status(404).json({ message: "Không tìm thấy độc giả" });
        }
        res.status(200).json(reader);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const addNewReader = async (req, res) => {
    try {
        const { reader_code, name, phone } = req.body;
        const existingReader = await readerModel.findOne({ reader_code });
        if (existingReader) {
            return res.status(400).json({ message: "Mã độc giả đã tồn tại" });
        }
        const newReader = new readerModel({ reader_code, name, phone });
        await newReader.save();
        res.status(201).json(newReader);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const updateReader = async (req, res) => {
  try {
    const { id } = req.params;
    const { reader_code, name, phone } = req.body;

    const reader = await readerModel.findById(id);
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }

    reader.reader_code = reader_code ?? reader.reader_code;
    reader.name = name ?? reader.name;
    reader.phone = phone ?? reader.phone;

    await reader.save();
    res.status(200).json(reader);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteReader = async (req, res) => {
    try {
        const {id} = req.params;
        const reader = await readerModel.findById(id);
        if(!reader) {
            return res.status(404).json({ message: "Không tìm thấy độc giả" });
        }
        await readerModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa độc giả thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};


    