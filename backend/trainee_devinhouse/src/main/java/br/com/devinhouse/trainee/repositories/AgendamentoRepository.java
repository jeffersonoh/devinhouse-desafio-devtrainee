package br.com.devinhouse.trainee.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import br.com.devinhouse.trainee.entities.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer>{

}
