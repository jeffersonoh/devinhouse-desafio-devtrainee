package br.com.devinhouse.spring.trabalhospringboot.dto;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class AgendaDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDate data;
    @Column(nullable = false)
    private String exame;
    @Column(nullable = false)
    private String pacienteNome;

    public static AgendaDTO converter(AgendaDTO a){
        var agenda = new AgendaDTO();

        agenda.setId(a.getId());
        agenda.setData(a.getData());
        agenda.setExame(a.getExame());
        agenda.setPacienteNome(a.getPacienteNome());

        return agenda;
    }
}
