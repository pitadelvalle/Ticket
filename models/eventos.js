var mongoose = require('mongoose');
//
var eventoSchema = mongoose.Schema({
    Categoria: { type: String, required: true},
    Nombre: { type: String, required: true },
    Localizacion: { type: String, required: true },
    fecha: { type: Date, default: Date.now,required: true},
    Boletos:{type: Number,required: true}
});

//
eventoSchema.methods.name = function() {
    return this.Nombre || this.Localizacion || this.fecha;
}

var Evento = mongoose.model("Eventos", eventoSchema);
module.exports = Evento;