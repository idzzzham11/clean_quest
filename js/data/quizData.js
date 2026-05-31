// 10 soalan kuiz dalam Bahasa Melayu — dikongsi merentas semua peringkat
// correctIndex: 0=A, 1=B, 2=C, 3=D
var _sharedQuestions = [
    {
        id: 'Q1',
        icon: '👔',
        question: 'Bagaimanakah seseorang dapat mengekalkan penampilan diri yang profesional melalui pakaian di tempat kerja?',
        options: [
            'Memakai pakaian sukan jika kerja tidak memerlukan aktiviti fizikal',
            'Memastikan pakaian sentiasa bersih, tidak berkedut, dan sesuai',
            'Mengabaikan kod pakaian syarikat jika ia terlalu ketat',
            'Memakai pakaian yang sama setiap hari untuk menjimatkan masa'
        ],
        correctIndex: 1,
        explanation: 'Pakaian yang bersih, kemas dan sesuai mencerminkan profesionalisme dan rasa hormat terhadap majikan serta pelanggan.',
        reward: { type: 'coins', amount: 50 }
    },
    {
        id: 'Q2',
        icon: '💅',
        question: 'Mengapakah menjaga kebersihan kuku penting sebagai sebahagian daripada penampilan diri di tempat kerja?',
        options: [
            'Kuku yang bersih dan pendek menunjukkan perhatian kepada perincian dan kebersihan',
            'Ia tidak penting selagi kerja disiapkan',
            'Kuku yang panjang menunjukkan status',
            'Ia membantu dalam tugas menaip yang lebih pantas'
        ],
        correctIndex: 0,
        explanation: 'Kuku yang bersih dan pendek mengelakkan pembiakan kuman serta menunjukkan tahap kebersihan diri yang tinggi.',
        reward: { type: 'coins', amount: 50 }
    },
    {
        id: 'Q3',
        icon: '🙌',
        question: 'Bagaimana amalan kebersihan tangan yang baik menyumbang kepada persekitaran kerja yang sihat?',
        options: [
            'Ia membolehkan pekerja makan tanpa perlu risau',
            'Ia adalah satu-satunya cara untuk mengelakkan selsema',
            'Ia hanya penting jika anda bekerja di hospital',
            'Ia mengurangkan risiko penyebaran kuman dan penyakit di kalangan pekerja'
        ],
        correctIndex: 3,
        explanation: 'Mencuci tangan dengan kerap mengurangkan penyebaran kuman dan penyakit yang boleh menjejaskan semua pekerja.',
        reward: { type: 'star', amount: 1 }
    },
    {
        id: 'Q4',
        icon: '🚫',
        question: 'Manakah antara berikut BUKAN amalan kebersihan diri yang sesuai di tempat kerja?',
        options: [
            'Mandi sekurang-kurangnya sekali sehari',
            'Memakai deodoran atau antiperspirant',
            'Menggunakan minyak wangi atau pewangi badan secara berlebihan',
            'Memberus gigi selepas makan'
        ],
        correctIndex: 2,
        explanation: 'Penggunaan minyak wangi yang berlebihan boleh mengganggu rakan sekerja dan pelanggan, terutama mereka yang alah kepada bau-bauan.',
        reward: { type: 'coins', amount: 50 }
    },
    {
        id: 'Q5',
        icon: '👗',
        question: 'Dalam konteks penampilan diri, apakah yang dimaksudkan dengan \'kod etika pakaian\' di tempat kerja?',
        options: [
            'Pilihan pakaian peribadi yang bebas tanpa sekatan',
            'Garis panduan syarikat mengenai pakaian yang profesional dan sesuai',
            'Pakaian yang paling mahal dan berjenama',
            'Pakaian yang selesa dipakai semasa waktu rehat sahaja'
        ],
        correctIndex: 1,
        explanation: 'Kod etika pakaian adalah garis panduan syarikat yang memastikan semua pekerja berpakaian secara profesional dan seragam.',
        reward: { type: 'coins', amount: 50 }
    },
    {
        id: 'Q6',
        icon: '🧼',
        question: 'Manakah antara berikut merupakan amalan kebersihan diri yang paling penting dalam bidang kerja?',
        options: [
            'Memakai pewangi yang kuat',
            'Mandi sekurang-kurangnya sekali sehari dan menjaga kebersihan pakaian',
            'Menggunakan deodoran tanpa mencuci badan',
            'Memotong kuku hanya apabila perlu'
        ],
        correctIndex: 1,
        explanation: 'Mandi setiap hari dan memakai pakaian bersih adalah asas kebersihan diri yang menjaga kesihatan diri dan persekitaran kerja.',
        reward: { type: 'star', amount: 1 }
    },
    {
        id: 'Q7',
        icon: '💇',
        question: 'Bagaimanakah seseorang pekerja boleh memastikan kebersihan rambut mereka di tempat kerja?',
        options: [
            'Membiarkan rambut kusut dan tidak terurus',
            'Mencuci rambut hanya sebulan sekali',
            'Menjaga rambut agar sentiasa bersih, tersisir, dan kemas',
            'Menggunakan produk rambut yang berbau kuat'
        ],
        correctIndex: 2,
        explanation: 'Rambut yang bersih, tersisir dan kemas mencerminkan imej profesional dan mengelakkan gangguan kepada rakan sekerja.',
        reward: { type: 'coins', amount: 50 }
    },
    {
        id: 'Q8',
        icon: '🦠',
        question: 'Mengapa penting untuk menjaga kebersihan tangan di tempat kerja, terutamanya dalam bidang yang melibatkan interaksi dengan orang lain atau makanan?',
        options: [
            'Mengurangkan penyebaran kuman dan penyakit',
            'Menjadikan kulit tangan lebih lembut',
            'Memudahkan memegang objek yang licin',
            'Untuk mengelakkan kuku rosak'
        ],
        correctIndex: 0,
        explanation: 'Tangan yang bersih mengurangkan pemindahan kuman kepada orang lain dan makanan, melindungi kesihatan semua pihak.',
        reward: { type: 'coins', amount: 50 }
    },
    {
        id: 'Q9',
        icon: '👕',
        question: 'Dalam bidang kerja yang memerlukan penggunaan uniform, apakah yang perlu diberi perhatian mengenai uniform tersebut?',
        options: [
            'Memastikan uniform sentiasa bersih, kemas, dan dipakai dengan lengkap',
            'Mengubah suai uniform agar kelihatan lebih fesyen',
            'Memakai uniform yang lusuh dan berlubang',
            'Menjadikan uniform sebagai pakaian harian di luar waktu kerja'
        ],
        correctIndex: 0,
        explanation: 'Uniform yang bersih dan kemas mencerminkan standard profesional syarikat dan memberi keyakinan kepada pelanggan.',
        reward: { type: 'star', amount: 1 }
    },
    {
        id: 'Q10',
        icon: '😊',
        question: 'Jika anda bekerja di bahagian khidmat pelanggan, bagaimana amalan kebersihan dan penampilan diri anda boleh mempengaruhi pelanggan?',
        options: [
            'Penampilan yang baik boleh meningkatkan keyakinan pelanggan dan imej syarikat',
            'Pekerja boleh memakai apa sahaja asalkan mesra pelanggan',
            'Kebersihan tidak relevan jika produk atau perkhidmatan bagus',
            'Pelanggan tidak akan mengambil peduli tentang penampilan pekerja'
        ],
        correctIndex: 0,
        explanation: 'Penampilan yang kemas dan bersih meningkatkan kepercayaan pelanggan serta mencerminkan imej positif syarikat.',
        reward: { type: 'star', amount: 1 }
    }
];

// All levels share the same 10 questions
var QuizData = {
    level1: _sharedQuestions,
    level2: _sharedQuestions,
    level3: _sharedQuestions,
    level4: _sharedQuestions,
    level5: _sharedQuestions
};
