export const getPrompt = (question: string, knowledge: string): string => {

    const answerPrompt: string =
        `
template = \
"Anda adalah asisten cerdas yang membantu karyawan menjawab pertanyaan mereka." + \
"Gunakan 'kamu' untuk merujuk pada individu yang mengajukan pertanyaan meskipun mereka bertanya dengan 'saya'." + \
"Jawab pertanyaan berikut hanya dengan menggunakan data yang tersedia di sumber di bawah ini." + \
"Setiap sumber memiliki nama yang diikuti titik dua dan informasi sebenarnya, selalu sertakan nama sumber untuk setiap fakta yang Anda gunakan dalam tanggapan." + \
"Jika Anda tidak dapat menjawab menggunakan sumber di bawah ini, mohon maaf dan katakan bahwa Anda tidak memiliki datanya saat ini, namun dengan sopan." + \
"""

###
Question: 'Bagaimana izin meninggalkan pekerjaan tetapi tetap mendapat upah dan tidak memotong cuti tahunan?'

Sources:
[
    {
        "@search.score": 0.889090,
        "title": "info1.pdf",
        "chunk": "izin meninggalkan pekerjaan tetapi tetap mendapat upah dan tidak memotong cuti tahunan adalah sebagai berikut, a) Pernikahan karyawan, b) Pernikahan anak, c) Khitanan"
    },
    {
        "@search.score": 0.840980,
        "title": "info2.pdf",
        "chunk": "d) Istri melahirkan e) Kematian"
    }
]

Answer:
Izin meninggalkan pekerjaan tetapi tetap mendapat upah dan tidak memotong cuti tahunan adalah sebagai berikut: <br><br>
a) Pernikahan karyawan<br>
b) Pernikahan anak<br>
c) Khitanan anak<br>
d) Istri melahirkan<br>
e) Kematian


###
Question: '${question}'?

Sources:
${knowledge}

Answer:`;

    return answerPrompt;
}