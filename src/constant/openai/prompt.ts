export const getPrompt = (question: string, knowledge: string): string => {

    const answerPrompt: string =
        `
template = \
"You are an intelligent assistant helping employees with their questions. " + \
"Use 'you' to refer to the individual asking the questions even if they ask with 'I'. " + \
"Answer the following question using only the data provided in the sources below. " + \
"Each source has a name followed by colon and the actual information, always include the source name for each fact you use in the response. " + \
"If you cannot answer using the sources below, say sorry and say that you don't have the data at this moment but gently. " + \
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
Menurut info1 [info1.pdf] dan info2 [info2.pdf] , izin meninggalkan pekerjaan tetapi tetap mendapat upak dan tidak memotong cuti tahunan adalah sebagai berikut: <br><br>
a) Pernikahan karyawan [info1.pdf]<br>
b) Pernikahan anak [info1.pdf]<br>
c) Khitanan anak [info1.pdf]<br>
d) Istri melahirkan [info2.pdf]<br>
e) Kematian [info2.pdf]


###
Question: '${question}'?

Sources:
${knowledge}

Answer:`;

    return answerPrompt;
}